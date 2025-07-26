package com.englishlearning.application.practice.service;

import com.englishlearning.application.practice.dto.DictationPracticeDTO;
import com.englishlearning.application.practice.dto.DictationPracticeQueryDTO;

import java.util.List;

/**
 * 听写练习应用服务接口
 */
public interface DictationPracticeApplicationService {
    
    /**
     * 创建听写练习
     *
     * @param dto      听写练习DTO
     * @param userId   用户ID
     * @param username 用户名
     * @return 创建后的听写练习DTO
     */
    DictationPracticeDTO create(DictationPracticeDTO dto, String userId, String username);
    
    /**
     * 更新听写练习
     *
     * @param dto      听写练习DTO
     * @param userId   用户ID
     * @param username 用户名
     * @return 更新后的听写练习DTO
     */
    DictationPracticeDTO update(DictationPracticeDTO dto, String userId, String username);
    
    /**
     * 提交听写练习
     *
     * @param id       听写练习ID
     * @param userId   用户ID
     * @param username 用户名
     * @return 提交后的听写练习DTO
     */
    DictationPracticeDTO submit(Long id, String userId, String username);
    
    /**
     * 评分听写练习
     *
     * @param id       听写练习ID
     * @param score    分数
     * @param userId   用户ID
     * @param username 用户名
     * @return 评分后的听写练习DTO
     */
    DictationPracticeDTO score(Long id, Integer score, String userId, String username);
    
    /**
     * 根据ID查询听写练习
     *
     * @param id 听写练习ID
     * @return 听写练习DTO
     */
    DictationPracticeDTO findById(Long id);
    
    /**
     * 分页查询听写练习
     *
     * @param queryDTO 查询参数
     * @return 听写练习DTO列表
     */
    List<DictationPracticeDTO> findByPage(DictationPracticeQueryDTO queryDTO);
    
    /**
     * 统计听写练习数量
     *
     * @param queryDTO 查询参数
     * @return 听写练习数量
     */
    long count(DictationPracticeQueryDTO queryDTO);
    
    /**
     * 根据ID删除听写练习
     *
     * @param id       听写练习ID
     * @param userId   用户ID
     * @param username 用户名
     */
    void deleteById(Long id, String userId, String username);
    
    /**
     * 批量删除听写练习
     *
     * @param ids      听写练习ID列表
     * @param userId   用户ID
     * @param username 用户名
     */
    void deleteByIds(List<Long> ids, String userId, String username);
}