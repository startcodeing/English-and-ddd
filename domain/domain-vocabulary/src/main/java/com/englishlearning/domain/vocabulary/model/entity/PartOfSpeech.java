package com.englishlearning.domain.vocabulary.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 词性实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartOfSpeech {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 英文名称
     */
    private String englishName;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 用法总结
     */
    private String usageSummary;
    
    /**
     * 常用短语/搭配
     */
    private List<String> commonPhrases;
} 