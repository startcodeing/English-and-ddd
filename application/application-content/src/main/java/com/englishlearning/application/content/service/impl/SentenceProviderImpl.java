package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.service.SentenceApplicationService;
import com.englishlearning.application.vocabulary.dto.ExampleSentenceDTO;
import com.englishlearning.application.vocabulary.dto.ExampleSentenceDetailDTO;
import com.englishlearning.application.vocabulary.service.SentenceProvider;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class SentenceProviderImpl implements SentenceProvider {

    private final SentenceApplicationService sentenceApplicationService;

    public SentenceProviderImpl(SentenceApplicationService sentenceApplicationService) {
        this.sentenceApplicationService = sentenceApplicationService;
    }


    @Override
    public List<String> addSentence(List<ExampleSentenceDTO.SentenceDTO> sentenceList) {
        if (CollectionUtils.isEmpty(sentenceList)) {
            return List.of();
        }

        List<String> sentenceIdList = new ArrayList<>();
        sentenceList.forEach(sentence -> {
            SentenceDTO sentenceDTO = com.englishlearning.application.content.dto.SentenceDTO.builder()
                    .englishContent(sentence.getEnglishContent())
                    .chineseMeaning(sentence.getChineseMeaning())
                    .build();

            SentenceDTO savedSentence = sentenceApplicationService.createSentence(sentenceDTO);
            if (!Objects.isNull(savedSentence)) {
                sentenceIdList.add(savedSentence.getId());
            }
        });
        return sentenceIdList;
    }


    @Override
    public List<ExampleSentenceDetailDTO> getSentenceDetail(List<String> sentenceIdList) {
        if (CollectionUtils.isEmpty(sentenceIdList)) {
            return List.of();
        }

        return sentenceIdList.stream().map(sentenceApplicationService::findSentenceById)
                .flatMap(Optional::stream)
                .map(sentenceDTO -> ExampleSentenceDetailDTO.builder()
                        .id(sentenceDTO.getId())
                        .englishContent(sentenceDTO.getEnglishContent())
                        .chineseMeaning(sentenceDTO.getChineseMeaning())
                        .build())
                .toList();

    }
}
