package com.englishlearning.domain.content.service.impl;

import com.englishlearning.common.types.Result;
import com.englishlearning.domain.content.event.ArticleCreatedEvent;
import com.englishlearning.domain.content.event.ArticleUpdatedEvent;
import com.englishlearning.domain.content.event.ArticleEventPublisher;
import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.repository.ArticleRepository;
import com.englishlearning.domain.content.repository.SentenceRepository;
import com.englishlearning.domain.content.service.ArticleService;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 * 文章领域服务实现
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ArticleServiceImpl implements ArticleService {
    
    private final ArticleRepository articleRepository;
    private final SentenceRepository sentenceRepository;
    private final WordRepository wordRepository;
    private final ArticleEventPublisher eventPublisher;
    
    // 用于句子切分的正则表达式
    private static final Pattern SENTENCE_PATTERN = Pattern.compile("[^.!?\\s][^.!?]*(?:[.!?](?!['\"]?\\s|$)[^.!?]*)*[.!?]?['\"]?(?=\\s|$)");
    
    @Override
    public Article createArticle(Article article) {
        Article savedArticle = articleRepository.save(article);
        int sentenceCount = (savedArticle.getSentences() != null) ? savedArticle.getSentences().size() : 0;
        eventPublisher.publishArticleCreatedEvent(new ArticleCreatedEvent(
            savedArticle.getId(),
            savedArticle.getTitle(),
            savedArticle.getDifficultyLevel(),
            sentenceCount
        ));
        return savedArticle;
    }
    
    @Override
    public Article updateArticle(Article article) {
        Article updatedArticle = articleRepository.save(article);
        eventPublisher.publishArticleUpdatedEvent(new ArticleUpdatedEvent(
            updatedArticle.getId(),
            updatedArticle.getTitle(),
            updatedArticle.getContent(),
            updatedArticle.getDifficultyLevel()
        ));
        return updatedArticle;
    }
    
    @Override
    public Optional<Article> findArticleById(String id) {
        return articleRepository.findById(id);
    }
    
    @Override
    public List<Article> findAllArticles() {
        return articleRepository.findAll();
    }
    
    @Override
    public List<Article> findArticlesByTitle(String title) {
        return articleRepository.findByTitleLike(title);
    }
    
    @Override
    public List<Article> findArticlesByAuthor(String author) {
        return articleRepository.findByAuthor(author);
    }
    
    @Override
    public List<Article> findArticlesBySource(String source) {
        return articleRepository.findBySource(source);
    }
    
    @Override
    public List<Article> findArticlesByDifficultyLevel(Integer difficultyLevel) {
        return articleRepository.findByDifficultyLevel(difficultyLevel);
    }
    
    @Override
    public Article addSentence(String articleId, Sentence sentence) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        if (article.getSentences() == null) {
            article.setSentences(new ArrayList<>());
        }
        
        // 保存句子
        Sentence savedSentence = sentenceRepository.save(sentence);
        
        // 添加到文章
        article.getSentences().add(savedSentence);
        return articleRepository.save(article);
    }
    
    @Override
    public Article removeSentence(String articleId, String sentenceId) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        if (article.getSentences() != null) {
            article.setSentences(
                article.getSentences().stream()
                    .filter(s -> !s.getId().equals(sentenceId))
                    .collect(Collectors.toList())
            );
        }
        
        return articleRepository.save(article);
    }
    
    @Override
    public Article addUnfamiliarWord(String articleId, Word word) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        if (article.getUnfamiliarWords() == null) {
            article.setUnfamiliarWords(new ArrayList<>());
        }
        
        // 避免重复添加
        boolean wordExists = article.getUnfamiliarWords().stream()
            .anyMatch(w -> w.getId().equals(word.getId()));
        
        if (!wordExists) {
            article.getUnfamiliarWords().add(word);
        }
        
        return articleRepository.save(article);
    }
    
    @Override
    public Article removeUnfamiliarWord(String articleId, String wordId) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        if (article.getUnfamiliarWords() != null) {
            article.setUnfamiliarWords(
                article.getUnfamiliarWords().stream()
                    .filter(w -> !w.getId().equals(wordId))
                    .collect(Collectors.toList())
            );
        }
        
        return articleRepository.save(article);
    }
    
    @Override
    public List<Sentence> extractSentences(String articleId) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        // 使用正则表达式分割文章为句子
        Matcher matcher = SENTENCE_PATTERN.matcher(article.getContent());
        List<Sentence> sentences = new ArrayList<>();
        
        while (matcher.find()) {
            String content = matcher.group().trim();
            Sentence sentence = Sentence.builder()
                .englishContent(content)
                .build();
            sentences.add(sentence);
        }
        
        // 保存所有提取的句子
        List<Sentence> savedSentences = new ArrayList<>();
        for (Sentence sentence : sentences) {
            savedSentences.add(sentenceRepository.save(sentence));
        }
        
        // 更新文章的句子列表
        article.setSentences(savedSentences);
        articleRepository.save(article);
        
        return savedSentences;
    }
    
    @Override
    public List<Word> identifyUnfamiliarWords(String articleId, List<String> knownWordIds) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        // 从文章内容中提取所有单词
        String[] words = article.getContent().replaceAll("[^a-zA-Z' ]", " ").split("\\s+");
        List<String> uniqueWords = Arrays.stream(words)
            .filter(w -> w.length() > 0)
            .map(String::toLowerCase)
            .distinct()
            .collect(Collectors.toList());
        
        // 找出库中存在的单词
        List<Word> allWords = wordRepository.findBySpellingIn(uniqueWords);
        
        // 过滤掉已知单词
        List<Word> unfamiliarWords = allWords.stream()
            .filter(word -> !knownWordIds.contains(word.getId()))
            .collect(Collectors.toList());
        
        // 更新文章的陌生单词列表
        article.setUnfamiliarWords(unfamiliarWords);
        articleRepository.save(article);
        
        return unfamiliarWords;
    }
    
    @Override
    public void deleteArticle(String articleId) {
        articleRepository.deleteById(articleId);
        eventPublisher.publishArticleDeletedEvent(articleId);
    }
} 