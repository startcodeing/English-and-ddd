package com.englishlearning.domain.content.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 句子变体实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentenceVariant {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 变体内容
     */
    private String content;
    
    /**
     * 变体类型
     */
    private String type;
    
    /**
     * 变体说明
     */
    private String description;
} 