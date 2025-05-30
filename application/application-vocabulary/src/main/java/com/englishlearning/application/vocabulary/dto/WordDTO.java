package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 单词DTO
 * 包含单词基本信息和多个词义（不同词性下的含义）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordDTO {
    private String id;
    private String spelling;
    private String phonetic;
    private Integer difficultyLevel;
    
    /**
     * 词义列表（不同词性下的含义、同义词、反义词和例句）
     */
    private List<WordMeaningDTO> wordMeanings;
}