package com.englishlearning.application.vocabulary.mapper;

import com.englishlearning.application.vocabulary.dto.WordMeaningDTO;
import com.englishlearning.application.vocabulary.dto.WordMeaningDetailDTO;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;

import java.util.List;

/**
 * 单词词义映射器
 * 负责WordMeaning实体与WordMeaningDTO之间的转换
 */
public interface WordMeaningMapper {

    /**
     * 将领域实体转换为DTO
     * @param meaning 词义领域实体
     * @return 词义DTO
     */
    WordMeaningDTO toDTO(WordMeaning meaning);
    
    /**
     * 将DTO转换为领域实体
     * @param dto 词义DTO
     * @return 词义领域实体
     */
    WordMeaning toEntity(WordMeaningDTO dto);
    
    /**
     * 将领域实体列表转换为DTO列表
     * @param meanings 词义领域实体列表
     * @return 词义DTO列表
     */
    List<WordMeaningDTO> toDTOList(List<WordMeaning> meanings);
    
    /**
     * 将DTO列表转换为领域实体列表
     * @param dtos 词义DTO列表
     * @return 词义领域实体列表
     */
    List<WordMeaning> toEntityList(List<WordMeaningDTO> dtos);
    
    /**
     * 将领域实体转换为详情DTO
     * @param meaning 词义领域实体
     * @return 词义详情DTO
     */
    WordMeaningDetailDTO toDetailDTO(WordMeaning meaning);
    
    /**
     * 将领域实体列表转换为详情DTO列表
     * @param meanings 词义领域实体列表
     * @return 词义详情DTO列表
     */
    List<WordMeaningDetailDTO> toDetailDTOList(List<WordMeaning> meanings);
}