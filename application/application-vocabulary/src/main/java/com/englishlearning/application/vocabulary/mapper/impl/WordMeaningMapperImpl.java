package com.englishlearning.application.vocabulary.mapper.impl;

import com.englishlearning.application.vocabulary.dto.*;
import com.englishlearning.application.vocabulary.mapper.WordMeaningMapper;
import com.englishlearning.application.vocabulary.service.SentenceProvider;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.model.valueobject.AntonymInfo;
import com.englishlearning.domain.vocabulary.model.valueobject.SynonymInfo;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class WordMeaningMapperImpl implements WordMeaningMapper {

    private final WordRepository wordRepository;

    private final SentenceProvider sentenceProvider;

    public WordMeaningMapperImpl(WordRepository wordRepository, SentenceProvider sentenceProvider) {
        this.wordRepository = wordRepository;
        this.sentenceProvider = sentenceProvider;
    }

    @Override
    public WordMeaningDTO toDTO(WordMeaning meaning) {
        if (meaning == null) {
            return null;
        }
        
        return WordMeaningDTO.builder()
                .id(meaning.getId())
                .wordId(meaning.getWordId())
                .partOfSpeechId(meaning.getPartOfSpeechId())
                .chineseMeaning(meaning.getChineseMeaning())
                .synonymWordMeaningIds(meaning.getSynonymWordMeaningIds())
                .antonymWordMeaningIds(meaning.getAntonymWordMeaningIds())
                .exampleSentenceIds(meaning.getExampleSentenceIds())
                .build();
    }

    @Override
    public WordMeaning toEntity(WordMeaningDTO dto) {
        if (dto == null) {
            return null;
        }
        return WordMeaning.builder()
                .id(dto.getId())
                .wordId(dto.getWordId())
                .partOfSpeechId(dto.getPartOfSpeechId())
                .chineseMeaning(dto.getChineseMeaning())
                .synonymWordMeaningIds(dto.getSynonymWordMeaningIds())
                .antonymWordMeaningIds(dto.getAntonymWordMeaningIds())
                .exampleSentenceIds(dto.getExampleSentenceIds())
                .build();
    }

    @Override
    public List<WordMeaningDTO> toDTOList(List<WordMeaning> meanings) {
        if (meanings == null) {
            return null;
        }
        return meanings.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<WordMeaning> toEntityList(List<WordMeaningDTO> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }

    @Override
    public WordMeaningDetailDTO toDetailDTO(WordMeaning meaning) {
        if (meaning == null) {
            return null;
        }
        Optional<Word> word = wordRepository.findById(meaning.getWordId());
        String wordSpelling = word.map(Word::getSpelling).orElse(null);
        List<ExampleSentenceDetailDTO> sentenceDetail = sentenceProvider.getSentenceDetail(meaning.getExampleSentenceIds());
        return WordMeaningDetailDTO.builder()
                .id(meaning.getId())
                .wordId(meaning.getWordId())
                .partOfSpeechId(meaning.getPartOfSpeechId())
                .chineseMeaning(meaning.getChineseMeaning())
                .synonyms(convertSynonymInfosToDetailDTOs(meaning.getSynonymWordMeaningIds(),wordSpelling))
                .antonyms(convertAntonymInfosToDetailDTOs(meaning.getAntonymWordMeaningIds(),wordSpelling))
                .exampleSentenceIds(sentenceDetail)
                .build();
    }

    @Override
    public List<WordMeaningDetailDTO> toDetailDTOList(List<WordMeaning> meanings) {
        if (meanings == null) {
            return null;
        }
        return meanings.stream().map(this::toDetailDTO).collect(Collectors.toList());
    }



    // 辅助方法：将SynonymInfo列表转换为SynonymDetailDTO列表
    private List<SynonymDetailDTO> convertSynonymInfosToDetailDTOs(List<SynonymInfo> synonymInfos,String spell) {
        if (synonymInfos == null) {
            return new ArrayList<>();
        }
        return synonymInfos.stream()
                .map(info -> SynonymDetailDTO.builder()
                        .synonymWordId(info.getSynonymWordId())
                        .synonymMeaningId(info.getSynonymMeaningId())
                        .synonymSpell(spell)
                        .build())
                .collect(Collectors.toList());
    }

    // 辅助方法：将AntonymInfo列表转换为AntonymDetailDTO列表
    private List<AntonymDetailDTO> convertAntonymInfosToDetailDTOs(List<AntonymInfo> antonymInfos,String spell) {
        if (antonymInfos == null) {
            return new ArrayList<>();
        }
        return antonymInfos.stream()
                .map(info -> AntonymDetailDTO.builder()
                        .antonymWordId(info.getAntonymWordId())
                        .antonymMeaningId(info.getAntonymMeaningId())
                        .antonymSpell(spell)
                        .build())
                .collect(Collectors.toList());
    }
}