package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.WritingTopicPO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 写作主题JPA仓储接口
 */
@Repository
public interface WritingTopicJpaRepository extends JpaRepository<WritingTopicPO, Long> {
    
    /**
     * 根据描述模糊查询
     */
    List<WritingTopicPO> findByDescriptionContaining(String description);
    
    /**
     * 根据来源查询
     */
    List<WritingTopicPO> findBySource(String source);
    
    /**
     * 根据难度级别查询
     */
    List<WritingTopicPO> findByDifficulty(String difficulty);
    
    /**
     * 根据条件分页查询
     */
    @Query("SELECT w FROM WritingTopicPO w WHERE " +
           "(:description IS NULL OR w.description LIKE %:description%) AND " +
           "(:source IS NULL OR w.source = :source) AND " +
           "(:difficulty IS NULL OR w.difficulty = :difficulty)")
    Page<WritingTopicPO> findByCondition(
            @Param("description") String description,
            @Param("source") String source,
            @Param("difficulty") String difficulty,
            Pageable pageable);
    
    /**
     * 根据条件统计总数
     */
    @Query("SELECT COUNT(w) FROM WritingTopicPO w WHERE " +
           "(:description IS NULL OR w.description LIKE %:description%) AND " +
           "(:source IS NULL OR w.source = :source) AND " +
           "(:difficulty IS NULL OR w.difficulty = :difficulty)")
    long countByCondition(
            @Param("description") String description,
            @Param("source") String source,
            @Param("difficulty") String difficulty);
}