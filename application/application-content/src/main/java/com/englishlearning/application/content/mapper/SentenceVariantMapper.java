package com.englishlearning.application.content.mapper;

import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.domain.content.model.entity.SentenceVariant;

import java.util.List;

/**
 * 句子变体实体与DTO映射接口
 */
public interface SentenceVariantMapper {
    

    /**
     * 实体转DTO
     */
    SentenceVariantDTO toDTO(SentenceVariant entity);
    
    /**
     * DTO转实体
     */
    SentenceVariant toEntity(SentenceVariantDTO dto);
    
    /**
     * 实体列表转DTO列表
     */
    List<SentenceVariantDTO> toDTOList(List<SentenceVariant> entityList);
    
    /**
     * DTO列表转实体列表
     */
    List<SentenceVariant> toEntityList(List<SentenceVariantDTO> dtoList);
}