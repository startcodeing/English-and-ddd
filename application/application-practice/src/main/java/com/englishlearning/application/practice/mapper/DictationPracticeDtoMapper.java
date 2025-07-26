package com.englishlearning.application.practice.mapper;

import com.englishlearning.application.practice.dto.DictationPracticeDTO;
import com.englishlearning.domain.practice.model.entity.DictationPractice;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 听写练习DTO映射器
 */
@Mapper
public interface DictationPracticeDtoMapper {
    
    DictationPracticeDtoMapper INSTANCE = Mappers.getMapper(DictationPracticeDtoMapper.class);
    
    /**
     * 实体转DTO
     */
    DictationPracticeDTO toDTO(DictationPractice dictationPractice);
    
    /**
     * DTO转实体
     */
    DictationPractice toEntity(DictationPracticeDTO dictationPracticeDTO);
    
    /**
     * 实体列表转DTO列表
     */
    List<DictationPracticeDTO> toDTOList(List<DictationPractice> dictationPractices);
    
    /**
     * DTO列表转实体列表
     */
    List<DictationPractice> toEntityList(List<DictationPracticeDTO> dictationPracticeDTOs);
}