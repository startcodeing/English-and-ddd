package com.englishlearning.domain.content.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 句子创建事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentenceCreatedEvent {
    
    /**
     * 句子ID
     */
    private String sentenceId;
    
    /**
     * 句子英文内容
     */
    private String englishContent;
    
    /**
     * 句子中文意思
     */
    private String chineseMeaning;
} 