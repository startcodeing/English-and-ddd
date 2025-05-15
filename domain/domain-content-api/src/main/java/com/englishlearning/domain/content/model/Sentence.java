package com.englishlearning.domain.content.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sentence {
    private String id;
    private String content;
    private String translation;
    private String articleId;
    private List<String> words;
} 