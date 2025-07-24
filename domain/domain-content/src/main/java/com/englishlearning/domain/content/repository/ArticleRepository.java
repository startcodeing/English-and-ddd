package com.englishlearning.domain.content.repository;

import com.englishlearning.domain.content.model.entity.Article;

import java.util.List;
import java.util.Optional;

/**
 * 文章仓储接口
 */
public interface ArticleRepository {
    
    /**
     * 保存文章
     */
    Article save(Article article);
    
    /**
     * 根据ID查找文章
     */
    Optional<Article> findById(String id);
    
    /**
     * 根据标题模糊查询文章
     */
    List<Article> findByTitleLike(String title);
    
    /**
     * 根据内容模糊查询文章
     */
    List<Article> findByContentLike(String content);
    
    /**
     * 根据出处查询文章
     */
    List<Article> findBySource(String source);
    
    /**
     * 根据作者查询文章
     */
    List<Article> findByAuthor(String author);
    
    /**
     * 根据难度级别查询文章
     */
    List<Article> findByDifficultyLevel(Integer difficultyLevel);
    
    /**
     * 查询包含特定单词的文章
     */
    List<Article> findByUnfamiliarWordId(String wordId);
    
    /**
     * 查询包含特定句子的文章
     */
    List<Article> findBySentenceId(String sentenceId);
    
    /**
     * 查询所有文章
     */
    List<Article> findAll();
    
    /**
     * 分页查询文章列表
     *
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 文章列表
     */
    List<Article> findByPage(int pageNum, int pageSize);
    
    /**
     * 删除文章
     */
    void deleteById(String id);
    
    /**
     * 批量删除文章
     */
    void deleteAllById(List<String> ids);
    
    /**
     * 获取文章总数
     * 
     * @return 文章总数
     */
    long count();
}