package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.service.SentenceApplicationService;
import com.englishlearning.application.vocabulary.dto.AddWordMeaningExampleSentenceDTO;
import com.englishlearning.application.vocabulary.service.SentenceProvider;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class SentenceProviderImpl implements SentenceProvider {

    private final SentenceApplicationService sentenceApplicationService;

    public SentenceProviderImpl(SentenceApplicationService sentenceApplicationService) {
        this.sentenceApplicationService = sentenceApplicationService;
    }


    @Override
    public List<String> addSentence(List<AddWordMeaningExampleSentenceDTO.AddSentenceDTO> sentenceList) {
        if (CollectionUtils.isEmpty(sentenceList)) {
            return List.of();
        }

        List<String> sentenceIdList = new ArrayList<>();
        sentenceList.forEach(sentence -> {
            SentenceDTO sentenceDTO = SentenceDTO.builder()
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
}
