package com.englishlearning.domain.vocabulary.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 单词实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Word {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 拼写
     */
    private String spelling;
    
    /**
     * 词性
     */
    private PartOfSpeech partOfSpeech;
    
    /**
     * 发音
     */
    private String pronunciation;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 同义词列表
     */
    private List<Word> synonyms;
    
    /**
     * 反义词列表
     */
    private List<Word> antonyms;
    
    /**
     * 例句列表
     */
    private List<String> exampleSentences;
} 