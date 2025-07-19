package com.englishlearning.application.content.mapper.impl;

import com.englishlearning.application.content.dto.WritingTopicDTO;
import com.englishlearning.application.content.mapper.WritingTopicMapper;
import com.englishlearning.domain.content.dto.CreateWritingTopicDTO;
import com.englishlearning.domain.content.dto.UpdateWritingTopicDTO;
import com.englishlearning.domain.content.model.entity.WritingTopic;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 写作主题Mapper实现类
 */
@Component
public class WritingTopicMapperImpl implements WritingTopicMapper {
    
    @Override
    public CreateWritingTopicDTO toCreateCommand(WritingTopicDTO dto) {
        if (dto == null) {
            return null;
        }
        
        return CreateWritingTopicDTO.builder()
                .description(dto.getDescription())
                .source(dto.getSource())
                .difficulty(DifficultyLevel.fromCode(dto.getDifficulty()))
                .wordLimit(dto.getWordLimit())
                .timeLimit(dto.getTimeLimit())
                .build();
    }
    
    @Override
    public UpdateWritingTopicDTO toUpdateCommand(WritingTopicDTO dto) {
        if (dto == null) {
            return null;
        }
        
        return UpdateWritingTopicDTO.builder()
                .id(dto.getId())
                .description(dto.getDescription())
                .source(dto.getSource())
                .difficulty(DifficultyLevel.fromCode(dto.getDifficulty()))
                .wordLimit(dto.getWordLimit())
                .timeLimit(dto.getTimeLimit())
                .build();
    }
    
    @Override
    public WritingTopicDTO toDTO(WritingTopic entity) {
        if (entity == null) {
            return null;
        }
        
        return WritingTopicDTO.builder()
                .id(entity.getId())
                .description(entity.getDescription())
                .source(entity.getSource())
                .difficulty(entity.getDifficulty().getCode())
                .wordLimit(entity.getWordLimit())
                .timeLimit(entity.getTimeLimit())
                .createTime(entity.getCreateTime())
                .updateTime(entity.getUpdateTime())
                .build();
    }
    
    @Override
    public List<WritingTopicDTO> toDTOList(List<WritingTopic> entities) {
        if (entities == null) {
            return null;
        }
        
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}