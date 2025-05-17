package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.vocabulary.dto.WordDTO;

import java.util.List;
import java.util.Optional;

/**
 * 文章应用服务接口
 */
public interface ArticleApplicationService {
    
    /**
     * 创建文章
     */
    ArticleDTO createArticle(ArticleDTO articleDTO);
    
    /**
     * 更新文章
     */
    ArticleDTO updateArticle(ArticleDTO articleDTO);
    
    /**
     * 查找文章
     */
    Optional<ArticleDTO> findArticleById(String id);
    
    /**
     * 查找所有文章
     */
    List<ArticleDTO> findAllArticles();
    
    /**
     * 根据标题查找文章
     */
    List<ArticleDTO> findArticlesByTitle(String title);
    
    /**
     * 根据作者查找文章
     */
    List<ArticleDTO> findArticlesByAuthor(String author);
    
    /**
     * 根据出处查找文章
     */
    List<ArticleDTO> findArticlesBySource(String source);
    
    /**
     * 根据难度级别查找文章
     */
    List<ArticleDTO> findArticlesByDifficultyLevel(Integer difficultyLevel);
    
    /**
     * 为文章添加句子
     */
    ArticleDTO addSentence(String articleId, SentenceDTO sentenceDTO);
    
    /**
     * 为文章添加陌生单词
     */
    ArticleDTO addUnfamiliarWord(String articleId, WordDTO wordDTO);
    
    /**
     * 删除文章
     */
    void deleteArticle(String id);
}