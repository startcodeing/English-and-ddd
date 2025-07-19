package com.englishlearning.domain.content.repository;

import com.englishlearning.domain.content.model.entity.WritingTopic;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;

import java.util.List;
import java.util.Optional;

/**
 * 写作主题仓储接口
 */
public interface WritingTopicRepository {
    
    /**
     * 保存写作主题
     */
    WritingTopic save(WritingTopic writingTopic);
    
    /**
     * 根据ID查找写作主题
     */
    Optional<WritingTopic> findById(Long id);
    
    /**
     * 根据描述模糊查询写作主题
     */
    List<WritingTopic> findByDescriptionLike(String description);
    
    /**
     * 根据来源查询写作主题
     */
    List<WritingTopic> findBySource(String source);
    
    /**
     * 根据难度级别查询写作主题
     */
    List<WritingTopic> findByDifficulty(DifficultyLevel difficulty);
    
    /**
     * 查询所有写作主题
     */
    List<WritingTopic> findAll();
    
    /**
     * 分页查询写作主题
     */
    List<WritingTopic> findAll(int pageNum, int pageSize);
    
    /**
     * 根据条件分页查询写作主题
     */
    List<WritingTopic> findByCondition(String description, String source, DifficultyLevel difficulty, int pageNum, int pageSize);
    
    /**
     * 获取总记录数
     */
    long count();
    
    /**
     * 根据条件获取总记录数
     */
    long countByCondition(String description, String source, DifficultyLevel difficulty);
    
    /**
     * 删除写作主题
     */
    void deleteById(Long id);
    
    /**
     * 批量删除写作主题
     */
    void deleteAllById(List<Long> ids);
}