package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 添加单词词性例句DTO
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExampleSentenceDTO {

    private String wordId;
    private String wordMeaningId;
    private List<SentenceDTO> sentences;



    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SentenceDTO {
        private String englishContent;
        private String chineseMeaning;
    }
}