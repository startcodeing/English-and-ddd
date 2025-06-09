package com.englishlearning.application.vocabulary.mapper;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.dto.WordDetailDTO;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 单词映射器
 * 负责Word实体与WordDTO之间的转换
 */
@Mapper(componentModel = "spring", uses = {WordMeaningMapper.class})
public interface WordMapper {
    WordMapper INSTANCE = Mappers.getMapper(WordMapper.class);
    
    /**
     * 将领域实体转换为DTO
     * @param word 单词领域实体
     * @return 单词DTO
     */
    @Mapping(source = "id", target = "id")
    @Mapping(source = "spelling", target = "spelling")
    @Mapping(source = "phonetic", target = "phonetic")
    @Mapping(source = "difficultyLevel", target = "difficultyLevel")
    @Mapping(source = "meanings", target = "meanings")
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
}