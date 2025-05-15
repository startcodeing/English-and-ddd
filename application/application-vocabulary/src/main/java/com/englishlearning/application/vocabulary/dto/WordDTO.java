package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordDTO {
    private String id;
    private String word;
    private String meaning;
    private String pronunciation;
    private PartOfSpeechDTO partOfSpeech;
} 