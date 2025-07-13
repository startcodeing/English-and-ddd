package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.content.mapper.ArticleMapper;
import com.englishlearning.application.content.service.ArticleApplicationService;
import com.englishlearning.domain.content.dto.CreateArticleDTO;
import com.englishlearning.domain.content.dto.UpdateArticleDTO;
import com.englishlearning.domain.content.event.ArticleCreatedEvent;
import com.englishlearning.domain.content.event.ArticleDeletedEvent;
import com.englishlearning.domain.content.event.ArticleEventPublisher;
import com.englishlearning.domain.content.event.ArticleUpdatedEvent;
import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.repository.ArticleRepository;
import com.englishlearning.domain.content.repository.SentenceRepository;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * 文章应用服务实现类
 * 直接使用领域服务与领域层交互
 */
@Service
@RequiredArgsConstructor
public class ArticleApplicationServiceImpl implements ArticleApplicationService {
    
    private final ArticleRepository articleRepository;
    private final SentenceRepository sentenceRepository;
    private final WordRepository wordRepository;
    private final ArticleMapper articleMapper;
    private final ArticleEventPublisher articleEventPublisher;

    // 用于句子切分的正则表达式
    private static final Pattern SENTENCE_PATTERN = Pattern.compile("[^.!?\\s][^.!?]*(?:[.!?](?!['\"]?\\s|$)[^.!?]*)*[.!?]?['\"]?(?=\\s|$)");

    /**
     * 创建文章
     */
    @Transactional
    @Override
    public ArticleDTO createArticle(ArticleDTO articleDTO) {
        CreateArticleDTO command = CreateArticleDTO.builder()
                .title(articleDTO.getTitle())
                .content(articleDTO.getContent())
                .source(articleDTO.getSource())
                .author(articleDTO.getAuthor())
                .publishDate(articleDTO.getPublishDate())
                .difficultyLevel(articleDTO.getDifficultyLevel())
                .build();
        Article article = Article.builder()
                .id(UUID.randomUUID().toString())
                .build();
        article.create(command);
        Article saved = articleRepository.save(article);
        
        // 发布文章创建事件
        ArticleCreatedEvent event = new ArticleCreatedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setArticle(saved);
        articleEventPublisher.publishArticleCreatedEvent(event);
        
        return articleMapper.toDTO(saved);
    }
    
    /**
     * 更新文章
     */
    @Transactional
    @Override
    public ArticleDTO updateArticle(ArticleDTO articleDTO) {
        UpdateArticleDTO command = UpdateArticleDTO.builder()
                .id(articleDTO.getId())
                .title(articleDTO.getTitle())
                .content(articleDTO.getContent())
                .source(articleDTO.getSource())
                .author(articleDTO.getAuthor())
                .publishDate(articleDTO.getPublishDate())
                .difficultyLevel(articleDTO.getDifficultyLevel())
                .build();
        Article article = articleRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + command.getId()));

        article.update(command);
        Article saved = articleRepository.save(article);
        
        // 发布文章更新事件
        ArticleUpdatedEvent event = new ArticleUpdatedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setArticle(saved);
        articleEventPublisher.publishArticleUpdatedEvent(event);
        
        return articleMapper.toDTO(saved);
    }

    /**
     * 为文章添加句子
     */
    @Transactional
    @Override
    public ArticleDTO addSentence(String articleId, String sentenceId) {
        Article article = articleRepository.findById(articleId).orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        sentenceRepository.findById(sentenceId).orElseThrow(() -> new IllegalArgumentException("添加的句子不存在: " + sentenceId));
        article.addSentence(sentenceId);
        Article saved = articleRepository.save(article);
        return articleMapper.toDTO(saved);
    }


    /**
     * 为文章添加句子
     */
    @Transactional
    @Override
    public ArticleDTO removeSentence(String articleId, String sentenceId) {
        Article article = articleRepository.findById(articleId).orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        sentenceRepository.findById(sentenceId).orElseThrow(() -> new IllegalArgumentException("添加的句子不存在: " + sentenceId));
        article.removeSentence(sentenceId);
        Article saved = articleRepository.save(article);
        return articleMapper.toDTO(saved);
    }

    /**
     * 为文章添加陌生单词
     */
    @Transactional
    @Override
    public ArticleDTO addUnfamiliarWord(String articleId, String wordId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("添加的单词不存在: " + wordId));

        article.addUnfamiliarWord(word.getId());
        Article saved = articleRepository.save(article);
        return articleMapper.toDTO(saved);
    }


    /**
     * 为文章添加陌生单词
     */
    @Transactional
    @Override
    public ArticleDTO removeUnfamiliarWord(String articleId, String wordId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("添加的单词不存在: " + wordId));
        article.removeUnfamiliarWord(word.getId());
        Article saved = articleRepository.save(article);
        return articleMapper.toDTO(saved);
    }

    @Override
    public ArticleDTO identifyUnfamiliarWords(String articleId, List<String> knownWordIds) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));

        // 从文章内容中提取所有单词
        String[] words = article.getContent().replaceAll("[^a-zA-Z' ]", " ").split("\\s+");
        List<String> uniqueWords = Arrays.stream(words)
                .filter(w -> !w.isEmpty())
                .map(String::toLowerCase)
                .distinct()
                .collect(Collectors.toList());

        // 找出库中存在的单词
        List<Word> allWords = wordRepository.findBySpellingIn(uniqueWords);

        // 过滤掉已知单词
        List<String> unfamiliarWords = allWords.stream()
                .map(Word::getId)
                .filter(id -> !knownWordIds.contains(id))
                .collect(Collectors.toList());

        // 更新文章的陌生单词列表
        article.setUnfamiliarWords(unfamiliarWords);
        Article saved = articleRepository.save(article);
        return articleMapper.toDTO(saved);
    }

    @Override
    public ArticleDTO extractSentences(String articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));

        Matcher matcher = SENTENCE_PATTERN.matcher(article.getContent());
        List<Sentence> sentences = new ArrayList<>();
        while (matcher.find()) {
            String content = matcher.group().trim();
            Sentence sentence = Sentence.builder()
                    .englishContent(content)
                    .build();
            sentences.add(sentence);
        }

        List<String> savedSentenceIds = new ArrayList<>();
        for (Sentence sentence : sentences) {
            savedSentenceIds.add(sentenceRepository.save(sentence).getId());
        }

        article.setSentences(savedSentenceIds);
        Article saved = articleRepository.save(article);
        return articleMapper.toDTO(saved);
    }

    /**
     * 删除文章
     */
    @Transactional
    @Override
    public void deleteArticle(String id) {
        // 在删除前获取文章信息，用于事件发布
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + id));
        
        articleRepository.deleteById(id);
        
        // 发布文章删除事件
        ArticleDeletedEvent event = new ArticleDeletedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setArticle(article);
        articleEventPublisher.publishArticleDeletedEvent(event);
    }
    
    /**
     * 批量删除文章
     */
    @Transactional
    @Override
    public void batchDeleteArticles(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        articleRepository.deleteAllById(ids);
    }

    /**
     * 查找文章
     */
    @Override
    public Optional<ArticleDTO> findArticleById(String id) {
        return articleRepository.findById(id)
                .map(articleMapper::toDTO);
    }
    
    /**
     * 查找所有文章
     */
    @Override
    public List<ArticleDTO> findAllArticles() {
        return articleRepository.findAll().stream()
                .map(articleMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据标题查找文章
     */
    @Override
    public List<ArticleDTO> findArticlesByTitle(String title) {
        return articleRepository.findByTitleLike(title).stream()
                .map(articleMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据作者查找文章
     */
    @Override
    public List<ArticleDTO> findArticlesByAuthor(String author) {
        return articleRepository.findByAuthor(author).stream()
                .map(articleMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据出处查找文章
     */
    @Override
    public List<ArticleDTO> findArticlesBySource(String source) {
        return articleRepository.findBySource(source).stream()
                .map(articleMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据难度级别查找文章
     */
    @Override
    public List<ArticleDTO> findArticlesByDifficultyLevel(Integer difficultyLevel) {
        return articleRepository.findByDifficultyLevel(difficultyLevel).stream()
                .map(articleMapper::toDTO)
                .collect(Collectors.toList());
    }
}