package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 单词词义DTO
 * 表示单词在特定词性下的含义、同义词、反义词和例句
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordMeaningDTO {
    
    /**
     * ID
     */
    private String id;

    /**
     * 单词ID
     */
    private String wordId;
    
    /**
     * 词性
     */
    private String partOfSpeechId;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 同义词列表
     */
    private List<String> synonymWordMeaningIds;
    
    /**
     * 反义词列表
     */
    private List<String> antonymWordMeaningIds;
    
    /**
     * 例句主键列表
     */
    private List<String> exampleSentenceIds;


    /**
     * 新增例句列表
     */
    private List<AddWordMeaningExampleSentenceDTO.AddSentenceDTO> sentences;
}