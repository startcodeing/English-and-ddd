package com.englishlearning.domain.content.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    private String id;
    private String title;
    private String content;
    private String source;
    private String author;
    private LocalDateTime publishDate;
    private Integer difficultyLevel;
    private List<String> unfamiliarWords;
    private List<Sentence> sentences;
} 