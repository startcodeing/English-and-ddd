package com.englishlearning.domain.content.model.entity;

import com.englishlearning.domain.vocabulary.model.entity.Word;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 句子实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sentence {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 英文内容
     */
    private String englishContent;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 语法分析
     */
    private String grammarAnalysis;
    
    /**
     * 变体表示方式列表
     */
    private List<SentenceVariant> variants;
    
    /**
     * 陌生单词列表
     */
    private List<Word> unfamiliarWords;
} 