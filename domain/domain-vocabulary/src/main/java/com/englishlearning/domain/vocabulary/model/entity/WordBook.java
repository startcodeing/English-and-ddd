package com.englishlearning.domain.vocabulary.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 单词本实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordBook {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 名称
     */
    private String name;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 单词列表
     */
    private List<Word> words;
}