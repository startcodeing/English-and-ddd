package com.englishlearning.application.content.mapper;

import com.englishlearning.application.content.dto.WritingTopicDTO;
import com.englishlearning.domain.content.dto.CreateWritingTopicDTO;
import com.englishlearning.domain.content.dto.UpdateWritingTopicDTO;
import com.englishlearning.domain.content.model.entity.WritingTopic;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 写作主题Mapper接口
 */
public interface WritingTopicMapper {
    
    /**
     * 将DTO转换为创建实体命令
     */
    CreateWritingTopicDTO toCreateCommand(WritingTopicDTO dto);
    
    /**
     * 将DTO转换为更新实体命令
     */
    UpdateWritingTopicDTO toUpdateCommand(WritingTopicDTO dto);
    
    /**
     * 将实体转换为DTO
     */
    WritingTopicDTO toDTO(WritingTopic entity);
    
    /**
     * 将实体列表转换为DTO列表
     */
    List<WritingTopicDTO> toDTOList(List<WritingTopic> entities);
}