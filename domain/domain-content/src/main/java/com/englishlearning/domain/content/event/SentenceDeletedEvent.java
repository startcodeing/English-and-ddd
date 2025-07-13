package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.Sentence;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 句子删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentenceDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的句子
     */
    private Sentence sentence;
}