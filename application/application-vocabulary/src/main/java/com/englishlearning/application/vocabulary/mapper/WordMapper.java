package com.englishlearning.application.vocabulary.mapper;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.dto.WordDetailDTO;
import com.englishlearning.domain.vocabulary.model.entity.Word;

import java.util.List;

/**
 * 单词映射器
 * 负责Word实体与WordDTO之间的转换
 */
public interface WordMapper {
    
    /**
     * 将领域实体转换为DTO
     * @param word 单词领域实体
     * @return 单词DTO
     */
    WordDTO toDTO(Word word);
    
    /**
     * 将DTO转换为领域实体
     * @param dto 单词DTO
     * @return 单词领域实体
     */
    Word toEntity(WordDTO dto);
    
    /**
     * 将领域实体列表转换为DTO列表
     * @param words 单词领域实体列表
     * @return 单词DTO列表
     */
    List<WordDTO> toDTOList(List<Word> words);
    
    /**
     * 将DTO列表转换为领域实体列表
     * @param dtos 单词DTO列表
     * @return 单词领域实体列表
     */
    List<Word> toEntityList(List<WordDTO> dtos);
    
    /**
     * 将领域实体转换为详情DTO
     * @param word 单词领域实体
     * @return 单词详情DTO
     */
    WordDetailDTO toDetailDTO(Word word);
}