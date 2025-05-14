package com.englishlearning.application.content.mapper;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.domain.content.model.entity.Sentence;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 句子实体与DTO映射接口
 */
@Mapper(componentModel = "spring", uses = {SentenceVariantMapper.class})
public interface SentenceMapper {
    
    SentenceMapper INSTANCE = Mappers.getMapper(SentenceMapper.class);
    
    /**
     * 实体转DTO
     */
    SentenceDTO toDTO(Sentence entity);
    
    /**
     * DTO转实体
     */
    Sentence toEntity(SentenceDTO dto);
    
    /**
     * 实体列表转DTO列表
     */
    List<SentenceDTO> toDTOList(List<Sentence> entityList);
    
    /**
     * DTO列表转实体列表
     */
    List<Sentence> toEntityList(List<SentenceDTO> dtoList);
} 