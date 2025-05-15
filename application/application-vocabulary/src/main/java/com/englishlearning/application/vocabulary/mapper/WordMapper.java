package com.englishlearning.application.vocabulary.mapper;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WordMapper {
    WordMapper INSTANCE = Mappers.getMapper(WordMapper.class);
    
    WordDTO toDTO(Word word);
    Word toEntity(WordDTO dto);
    List<WordDTO> toDTOList(List<Word> words);
    List<Word> toEntityList(List<WordDTO> dtos);
} 