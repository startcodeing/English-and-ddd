package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.ArticlePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 文章JPA仓储接口
 */
@Repository
public interface ArticleJpaRepository extends JpaRepository<ArticlePO, String> {
    
    /**
     * 根据标题模糊查询
     */
    List<ArticlePO> findByTitleContaining(String title);
    
    /**
     * 根据内容模糊查询
     */
    List<ArticlePO> findByContentContaining(String content);
    
    /**
     * 根据出处查询
     */
    List<ArticlePO> findBySource(String source);
    
    /**
     * 根据作者查询
     */
    List<ArticlePO> findByAuthor(String author);
    
    /**
     * 根据难度级别查询
     */
    List<ArticlePO> findByDifficultyLevel(Integer difficultyLevel);
    
    /**
     * 查找包含特定单词的文章
     */
    @Query("SELECT a FROM ArticlePO a JOIN a.unfamiliarWords w WHERE w.id = :wordId")
    List<ArticlePO> findByUnfamiliarWordId(@Param("wordId") String wordId);
    
    /**
     * 查找包含特定句子的文章
     */
    @Query("SELECT a FROM ArticlePO a JOIN a.sentences s WHERE s.id = :sentenceId")
    List<ArticlePO> findBySentenceId(@Param("sentenceId") String sentenceId);
} 