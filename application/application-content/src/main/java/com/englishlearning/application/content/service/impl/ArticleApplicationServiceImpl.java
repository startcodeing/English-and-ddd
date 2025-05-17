package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.mapper.ArticleMapper;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.content.service.ArticleApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.domain.content.command.ArticleCommandHandler;
import com.englishlearning.domain.content.command.CreateArticleCommand;
import com.englishlearning.domain.content.command.DeleteArticleCommand;
import com.englishlearning.domain.content.command.UpdateArticleCommand;
import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.content.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 文章应用服务实现类
 * 使用命令处理器模式与领域层交互
 */
@Service
@RequiredArgsConstructor
public class ArticleApplicationServiceImpl implements ArticleApplicationService {
    
    private final ArticleRepository articleRepository;
    private final ArticleCommandHandler articleCommandHandler;
    private final ArticleMapper articleMapper;
    private final SentenceMapper sentenceMapper;

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
            
            // 通过命令处理器执行命令
            Article savedArticle = articleCommandHandler.handle(command);
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
            
            // 通过命令处理器执行命令
            Article updatedArticle = articleCommandHandler.handle(command);
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
            // 通过命令处理器执行命令
            Article updatedArticle = articleCommandHandler.addSentenceToArticle(
                    articleId,
                    sentenceMapper.toEntity(sentenceDTO).getArticleId()
            );
            
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
            // 通过命令处理器执行命令
            Article updatedArticle = articleCommandHandler.addWordToArticle(
                    articleId,
                    wordDTO.getId()
            );
            
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
            // 创建命令对象
            DeleteArticleCommand command = DeleteArticleCommand.builder()
                    .id(id)
                    .build();
            
            // 通过命令处理器执行命令
            articleCommandHandler.handle(command);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("删除文章失败: " + e.getMessage());
        }
    }
}