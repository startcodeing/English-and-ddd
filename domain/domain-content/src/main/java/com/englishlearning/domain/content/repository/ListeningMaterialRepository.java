package com.englishlearning.domain.content.repository;

import com.englishlearning.domain.content.model.entity.ListeningMaterial;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;

import java.util.List;
import java.util.Optional;

/**
 * 听力资料仓储接口
 */
public interface ListeningMaterialRepository {
    
    /**
     * 保存听力资料
     *
     * @param listeningMaterial 听力资料
     * @return 保存后的听力资料
     */
    ListeningMaterial save(ListeningMaterial listeningMaterial);
    
    /**
     * 根据ID查询听力资料
     *
     * @param id 听力资料ID
     * @return 听力资料
     */
    Optional<ListeningMaterial> findById(Long id);
    
    /**
     * 根据难度级别查询听力资料列表
     *
     * @param difficulty 难度级别
     * @return 听力资料列表
     */
    List<ListeningMaterial> findByDifficulty(DifficultyLevel difficulty);
    
    /**
     * 分页查询听力资料列表
     *
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 听力资料列表
     */
    List<ListeningMaterial> findByPage(int pageNum, int pageSize);
    
    /**
     * 根据ID删除听力资料
     *
     * @param id 听力资料ID
     */
    void deleteById(Long id);
    
    /**
     * 根据标题模糊查询听力资料列表
     *
     * @param title 标题关键字
     * @return 听力资料列表
     */
    List<ListeningMaterial> findByTitleContaining(String title);
}