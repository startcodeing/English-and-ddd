package com.englishlearning.domain.practice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 写作练习删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingDeletedEvent {
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 写作练习ID
     */
    private Long writingPracticeId;
}