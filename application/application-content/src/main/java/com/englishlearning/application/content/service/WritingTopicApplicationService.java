package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.WritingTopicDTO;
import com.englishlearning.common.types.PageRequest;

import java.util.List;
import java.util.Optional;

/**
 * 写作主题应用服务接口
 */
public interface WritingTopicApplicationService {
    
    /**
     * 创建写作主题
     */
    WritingTopicDTO createWritingTopic(WritingTopicDTO writingTopicDTO);
    
    /**
     * 更新写作主题
     */
    WritingTopicDTO updateWritingTopic(WritingTopicDTO writingTopicDTO);
    
    /**
     * 查找写作主题
     */
    Optional<WritingTopicDTO> findWritingTopicById(Long id);
    
    /**
     * 查找所有写作主题
     */
    List<WritingTopicDTO> findAllWritingTopics();
    
    /**
     * 分页查询写作主题
     */
    List<WritingTopicDTO> findWritingTopicsByPage(PageRequest pageRequest);
    
    /**
     * 根据条件分页查询写作主题
     */
    List<WritingTopicDTO> findWritingTopicsByCondition(String description, String source, String difficulty, PageRequest pageRequest);
    
    /**
     * 获取总记录数
     */
    long countWritingTopics();
    
    /**
     * 根据条件获取总记录数
     */
    long countWritingTopicsByCondition(String description, String source, String difficulty);
    
    /**
     * 删除写作主题
     */
    void deleteWritingTopic(Long id);
    
    /**
     * 批量删除写作主题
     */
    void batchDeleteWritingTopics(List<Long> ids);
}