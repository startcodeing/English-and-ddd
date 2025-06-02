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
    ArticleDTO addSentence(String articleId, String sentenceId);

    /**
     * 移除文章句子
     */
    ArticleDTO removeSentence(String articleId, String sentenceId);
    
    /**
     * 为文章添加陌生单词
     */
    ArticleDTO addUnfamiliarWord(String articleId, String wordId);

    /**
     * 删除文章包含的陌生单词
     */
    ArticleDTO removeUnfamiliarWord(String articleId, String wordId);
    
    /**
     * 删除文章
     */
    void deleteArticle(String id);

    /**
     * 识别文章中不认识的单词
     * @param articleId 文章主键
     * @param knownWordIds 已知的单词主键集合
     * @return 更新后的文章信息
     */
    ArticleDTO identifyUnfamiliarWords(String articleId, List<String> knownWordIds);

    /**
     * 从文章中抽取句子
     * @param articleId 文章主键
     * @return 文章信息
     */
    ArticleDTO extractSentences(String articleId);
}