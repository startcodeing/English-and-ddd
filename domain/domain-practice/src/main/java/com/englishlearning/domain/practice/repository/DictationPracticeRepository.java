package com.englishlearning.domain.practice.repository;

import com.englishlearning.domain.practice.model.entity.DictationPractice;

import java.util.List;
import java.util.Optional;

/**
 * 听写练习仓储接口
 */
public interface DictationPracticeRepository {
    
    /**
     * 保存听写练习
     */
    DictationPractice save(DictationPractice dictationPractice);
    
    /**
     * 根据ID查找听写练习
     */
    Optional<DictationPractice> findById(Long id);
    
    /**
     * 根据ID列表查找听写练习列表
     */
    List<DictationPractice> findByIdIn(List<Long> ids);
    
    /**
     * 根据听力资料ID查找听写练习列表
     */
    List<DictationPractice> findByListenMaterialId(Long listenMaterialId);
    
    /**
     * 根据状态查找听写练习列表
     */
    List<DictationPractice> findByStatus(String status);
    
    /**
     * 根据听力资料ID和状态查找听写练习列表
     */
    List<DictationPractice> findByListenMaterialIdAndStatus(Long listenMaterialId, String status);
    
    /**
     * 分页查询听写练习
     * 
     * @param listenMaterialId 听力资料ID，可为null
     * @param status 状态，可为null
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @return 听写练习列表
     */
    List<DictationPractice> findByPage(Long listenMaterialId, String status, int pageNum, int pageSize);
    
    /**
     * 统计听写练习数量
     * 
     * @param listenMaterialId 听力资料ID，可为null
     * @param status 状态，可为null
     * @return 听写练习数量
     */
    long count(Long listenMaterialId, String status);
    
    /**
     * 根据ID删除听写练习
     */
    void deleteById(Long id);
    
    /**
     * 批量删除听写练习
     */
    void deleteByIdIn(List<Long> ids);
}