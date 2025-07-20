package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.WritingPracticePO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 写作练习JPA仓储接口
 */
@Repository
public interface WritingPracticeJpaRepository extends JpaRepository<WritingPracticePO, Long> {
    
    /**
     * 根据主题ID查找写作练习
     */
    List<WritingPracticePO> findByTopicId(Long topicId);
    
    /**
     * 根据状态查找写作练习
     */
    List<WritingPracticePO> findByStatus(String status);
    
    /**
     * 根据主题ID和状态查找写作练习
     */
    List<WritingPracticePO> findByTopicIdAndStatus(Long topicId, String status);
    
    /**
     * 根据主题ID和状态查找写作练习（分页）
     */
    Page<WritingPracticePO> findByTopicIdAndStatus(Long topicId, String status, Pageable pageable);
    
    /**
     * 根据主题ID查找写作练习（分页）
     */
    Page<WritingPracticePO> findByTopicId(Long topicId, Pageable pageable);
    
    /**
     * 根据状态查找写作练习（分页）
     */
    Page<WritingPracticePO> findByStatus(String status, Pageable pageable);
    
    /**
     * 动态条件查询写作练习
     */
    @Query("SELECT p FROM WritingPracticePO p WHERE " +
           "(:topicId IS NULL OR p.topicId = :topicId) AND " +
           "(:status IS NULL OR p.status = :status)")
    Page<WritingPracticePO> findByConditions(
            @Param("topicId") Long topicId,
            @Param("status") String status,
            Pageable pageable);
    
    /**
     * 动态条件统计写作练习数量
     */
    @Query("SELECT COUNT(p) FROM WritingPracticePO p WHERE " +
           "(:topicId IS NULL OR p.topicId = :topicId) AND " +
           "(:status IS NULL OR p.status = :status)")
    long countByConditions(
            @Param("topicId") Long topicId,
            @Param("status") String status);
}