package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.mapper.ArticleMapper;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.content.service.ArticleApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.domain.content.command.CreateArticleCommand;
import com.englishlearning.domain.content.command.DeleteArticleCommand;
import com.englishlearning.domain.content.command.UpdateArticleCommand;
import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.repository.ArticleRepository;
import com.englishlearning.domain.content.repository.SentenceRepository;
import com.englishlearning.domain.content.service.ArticleService;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
    private final ArticleService articleService;
    private final ArticleMapper articleMapper;
    private final SentenceMapper sentenceMapper;
    private final WordMapper wordMapper;

    /**
     * 创建文章
     */
    @Transactional
    @Override
    public ArticleDTO createArticle(ArticleDTO articleDTO) {
        try {
            // 创建命令对象
            CreateArticleCommand command = CreateArticleCommand.builder()
                    .title(articleDTO.getTitle())
                    .content(articleDTO.getContent())
                    .source(articleDTO.getSource())
                    .author(articleDTO.getAuthor())
                    .publishDate(articleDTO.getPublishDate())
                    .difficultyLevel(articleDTO.getDifficultyLevel())
                    .build();
            
            // 创建文章实体
            Article article = Article.builder()
                    .id(UUID.randomUUID().toString())
                    .build();
            
            // 执行创建逻辑
            article.create(command);
            
            // 通过领域服务保存
            Article savedArticle = articleService.createArticle(article);
            return articleMapper.toDTO(savedArticle);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("创建文章失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新文章
     */
    @Transactional
    @Override
    public ArticleDTO updateArticle(ArticleDTO articleDTO) {
        try {
            // 创建命令对象
            UpdateArticleCommand command = UpdateArticleCommand.builder()
                    .id(articleDTO.getId())
                    .title(articleDTO.getTitle())
                    .content(articleDTO.getContent())
                    .source(articleDTO.getSource())
                    .author(articleDTO.getAuthor())
                    .publishDate(articleDTO.getPublishDate())
                    .difficultyLevel(articleDTO.getDifficultyLevel())
                    .build();
            
            // 查找现有文章
            Article article = articleRepository.findById(command.getId())
                    .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + command.getId()));
            
            // 执行更新逻辑
            article.update(command);
            
            // 通过领域服务保存
            Article updatedArticle = articleService.updateArticle(article);
            return articleMapper.toDTO(updatedArticle);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("更新文章失败: " + e.getMessage());
        }
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
    
    /**
     * 为文章添加句子
     */
    @Transactional
    @Override
    public ArticleDTO addSentence(String articleId, SentenceDTO sentenceDTO) {
        try {
            // 查找句子实体
            Sentence sentence = sentenceMapper.toEntity(sentenceDTO);
            
            // 通过领域服务添加句子
            Article updatedArticle = articleService.addSentence(articleId, sentence);
            
            // 转换为DTO并返回
            return articleMapper.toDTO(updatedArticle);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("添加句子失败: " + e.getMessage());
        }
    }
    
    /**
     * 为文章添加陌生单词
     */
    @Transactional
    @Override
    public ArticleDTO addUnfamiliarWord(String articleId, WordDTO wordDTO) {
        try {
            // 查找单词实体
            Word word = wordRepository.findById(wordDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordDTO.getId()));
            
            // 通过领域服务添加陌生单词
            Article updatedArticle = articleService.addUnfamiliarWord(articleId, word);
            
            // 转换为DTO并返回
            return articleMapper.toDTO(updatedArticle);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("添加陌生单词失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除文章
     */
    @Transactional
    @Override
    public void deleteArticle(String id) {
        try {
            // 通过领域服务删除文章
            articleService.deleteArticle(id);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("删除文章失败: " + e.getMessage());
        }
    }
}