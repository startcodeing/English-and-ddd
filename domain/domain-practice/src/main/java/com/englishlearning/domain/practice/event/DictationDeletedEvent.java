package com.englishlearning.domain.practice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 听写练习删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DictationDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 听写练习ID
     */
    private Long dictationPracticeId;
}