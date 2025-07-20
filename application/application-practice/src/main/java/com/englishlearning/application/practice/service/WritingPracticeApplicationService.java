package com.englishlearning.application.practice.service;

import com.englishlearning.application.practice.dto.WritingPracticeDTO;
import com.englishlearning.application.practice.dto.WritingPracticeQueryDTO;

import java.util.List;

/**
 * 写作练习应用服务接口
 */
public interface WritingPracticeApplicationService {
    
    /**
     * 创建写作练习
     * 
     * @param writingPracticeDTO 写作练习DTO
     * @return 创建后的写作练习DTO
     */
    WritingPracticeDTO createWritingPractice(WritingPracticeDTO writingPracticeDTO);
    
    /**
     * 更新写作练习
     * 
     * @param id 写作练习ID
     * @param writingPracticeDTO 写作练习DTO
     * @return 更新后的写作练习DTO
     */
    WritingPracticeDTO updateWritingPractice(Long id, WritingPracticeDTO writingPracticeDTO);
    
    /**
     * 提交写作练习
     * 
     * @param id 写作练习ID
     * @return 提交后的写作练习DTO
     */
    WritingPracticeDTO submitWritingPractice(Long id);
    
    /**
     * 评分写作练习
     * 
     * @param id 写作练习ID
     * @param score 分数
     * @return 评分后的写作练习DTO
     */
    WritingPracticeDTO scoreWritingPractice(Long id, Integer score);
    
    /**
     * 根据ID获取写作练习
     * 
     * @param id 写作练习ID
     * @return 写作练习DTO
     */
    WritingPracticeDTO getWritingPracticeById(Long id);
    
    /**
     * 分页查询写作练习
     * 
     * @param queryDTO 查询参数
     * @return 写作练习DTO列表
     */
    List<WritingPracticeDTO> getWritingPracticesByPage(WritingPracticeQueryDTO queryDTO);
    
    /**
     * 统计写作练习数量
     * 
     * @param queryDTO 查询参数
     * @return 写作练习数量
     */
    long countWritingPractices(WritingPracticeQueryDTO queryDTO);
    
    /**
     * 删除写作练习
     * 
     * @param id 写作练习ID
     */
    void deleteWritingPractice(Long id);
    
    /**
     * 批量删除写作练习
     * 
     * @param ids 写作练习ID列表
     */
    void batchDeleteWritingPractices(List<Long> ids);
}