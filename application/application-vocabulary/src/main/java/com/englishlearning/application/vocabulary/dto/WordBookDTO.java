package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 单词本数据传输对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordBookDTO {
    private String id;
    private String name;
    private String description;
    private List<WordDTO> words;
}