package com.englishlearning.domain.content.service;

import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.vocabulary.model.entity.Word;

import java.util.List;
import java.util.Optional;

/**
 * 文章领域服务接口
 */
public interface ArticleService {
    
    /**
     * 创建文章
     */
    Article createArticle(Article article);
    
    /**
     * 更新文章
     */
    Article updateArticle(Article article);
    
    /**
     * 查找文章
     */
    Optional<Article> findArticleById(String id);
    
    /**
     * 查找所有文章
     */
    List<Article> findAllArticles();
    
    /**
     * 根据标题查找文章
     */
    List<Article> findArticlesByTitle(String title);
    
    /**
     * 根据作者查找文章
     */
    List<Article> findArticlesByAuthor(String author);
    
    /**
     * 根据出处查找文章
     */
    List<Article> findArticlesBySource(String source);
    
    /**
     * 根据难度级别查找文章
     */
    List<Article> findArticlesByDifficultyLevel(Integer difficultyLevel);
    
    /**
     * 为文章添加句子
     */
    Article addSentence(String articleId, Sentence sentence);
    
    /**
     * 从文章中移除句子
     */
    Article removeSentence(String articleId, String sentenceId);
    
    /**
     * 为文章添加陌生单词
     */
    Article addUnfamiliarWord(String articleId, Word word);
    
    /**
     * 移除文章的陌生单词
     */
    Article removeUnfamiliarWord(String articleId, String wordId);
    
    /**
     * 从文章内容中提取句子
     */
    List<Sentence> extractSentences(String articleId);
    
    /**
     * 从文章内容中识别陌生单词
     */
    List<Word> identifyUnfamiliarWords(String articleId, List<String> knownWordIds);
    
    /**
     * 删除文章
     */
    void deleteArticle(String id);
} 