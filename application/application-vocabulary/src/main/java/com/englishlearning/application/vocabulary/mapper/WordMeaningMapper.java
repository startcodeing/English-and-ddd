package com.englishlearning.application.vocabulary.mapper;

import com.englishlearning.application.vocabulary.dto.WordMeaningDTO;
import com.englishlearning.application.vocabulary.dto.WordMeaningDetailDTO;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * 单词词义映射器
 * 负责WordMeaning实体与WordMeaningDTO之间的转换
 */
@Mapper(componentModel = "spring")
public interface WordMeaningMapper {

    /**
     * 将领域实体转换为DTO
     * @param meaning 词义领域实体
     * @return 词义DTO
     */
    @Mapping(source = "id", target = "id")
    @Mapping(source = "wordId", target = "wordId")
    @Mapping(source = "partOfSpeechId", target = "partOfSpeechId")
    @Mapping(source = "chineseMeaning", target = "chineseMeaning")
    @Mapping(source = "synonymWordMeaningIds", target = "synonymWordMeaningIds")
    @Mapping(source = "antonymWordMeaningIds", target = "antonymWordMeaningIds")
    @Mapping(source = "exampleSentenceIds", target = "exampleSentenceIds")
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
}