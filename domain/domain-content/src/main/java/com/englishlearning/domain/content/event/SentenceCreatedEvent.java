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
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 句子
     */
    private com.englishlearning.domain.content.model.entity.Sentence sentence;
}