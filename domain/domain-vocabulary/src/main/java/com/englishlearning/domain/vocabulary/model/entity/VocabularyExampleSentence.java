package com.englishlearning.domain.vocabulary.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 词汇例句实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyExampleSentence {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 英文例句
     */
    private String sentence;
    
    /**
     * 中文翻译
     */
    private String translation;
    
    /**
     * 创建时间
     */
    private Long createdAt;
    
    /**
     * 更新时间
     */
    private Long updatedAt;
    
    /**
     * 创建新例句
     */
    public void create() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = this.createdAt;
    }
    
    /**
     * 更新例句
     */
    public void update() {
        this.updatedAt = System.currentTimeMillis();
    }
}