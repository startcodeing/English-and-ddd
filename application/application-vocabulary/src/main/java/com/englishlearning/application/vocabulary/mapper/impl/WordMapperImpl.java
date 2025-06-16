package com.englishlearning.application.vocabulary.mapper.impl;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.dto.WordDetailDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.application.vocabulary.mapper.WordMeaningMapper;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class WordMapperImpl implements WordMapper {

    @Autowired
    private WordMeaningMapper wordMeaningMapper;

    @Override
    public WordDTO toDTO(Word word) {
        if (word == null) {
            return null;
        }
        
        return WordDTO.builder()
                .id(word.getId())
                .spelling(word.getSpelling())
                .phonetic(word.getPhonetic())
                .difficultyLevel(word.getDifficultyLevel())
                .meanings(word.getMeanings() != null ? 
                    wordMeaningMapper.toDTOList(word.getMeanings()) : null)
                .build();
    }

    @Override
    public Word toEntity(WordDTO dto) {
        if (dto == null) {
            return null;
        }
        
        return Word.builder()
                .id(dto.getId())
                .spelling(dto.getSpelling())
                .phonetic(dto.getPhonetic())
                .difficultyLevel(dto.getDifficultyLevel())
                .meanings(dto.getMeanings() != null ? 
                    wordMeaningMapper.toEntityList(dto.getMeanings()) : null)
                .build();
    }

    @Override
    public List<WordDTO> toDTOList(List<Word> words) {
        if (words == null) {
            return null;
        }
        return words.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<Word> toEntityList(List<WordDTO> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }

    @Override
    public WordDetailDTO toDetailDTO(Word word) {
        if (word == null) {
            return null;
        }
        
        return WordDetailDTO.builder()
                .id(word.getId())
                .spelling(word.getSpelling())
                .phonetic(word.getPhonetic())
                .difficultyLevel(word.getDifficultyLevel())
                .meanings(word.getMeanings() != null ? 
                    wordMeaningMapper.toDetailDTOList(word.getMeanings()) : null)
                .build();
    }
}