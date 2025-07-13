package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.Sentence;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 句子更新事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentenceUpdatedEvent {
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
    private Sentence sentence;
}