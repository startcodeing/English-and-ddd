package com.englishlearning.domain.practice.repository;

import com.englishlearning.domain.practice.model.entity.WritingPractice;

import java.util.List;
import java.util.Optional;

/**
 * 写作练习仓储接口
 */
public interface WritingPracticeRepository {
    
    /**
     * 保存写作练习
     */
    WritingPractice save(WritingPractice writingPractice);
    
    /**
     * 根据ID查找写作练习
     */
    Optional<WritingPractice> findById(Long id);
    
    /**
     * 根据ID列表查找写作练习列表
     */
    List<WritingPractice> findByIdIn(List<Long> ids);
    
    /**
     * 根据主题ID查找写作练习列表
     */
    List<WritingPractice> findByTopicId(Long topicId);
    
    /**
     * 根据状态查找写作练习列表
     */
    List<WritingPractice> findByStatus(String status);
    
    /**
     * 根据主题ID和状态查找写作练习列表
     */
    List<WritingPractice> findByTopicIdAndStatus(Long topicId, String status);
    
    /**
     * 分页查询写作练习
     * 
     * @param topicId 主题ID，可为null
     * @param status 状态，可为null
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @return 写作练习列表
     */
    List<WritingPractice> findByPage(Long topicId, String status, int pageNum, int pageSize);
    
    /**
     * 统计写作练习数量
     * 
     * @param topicId 主题ID，可为null
     * @param status 状态，可为null
     * @return 写作练习数量
     */
    long count(Long topicId, String status);
    
    /**
     * 根据ID删除写作练习
     */
    void deleteById(Long id);
    
    /**
     * 批量删除写作练习
     */
    void deleteByIdIn(List<Long> ids);
}