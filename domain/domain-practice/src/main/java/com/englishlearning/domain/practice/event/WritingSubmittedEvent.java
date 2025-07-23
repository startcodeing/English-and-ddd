package com.englishlearning.domain.practice.event;

import com.englishlearning.domain.practice.model.entity.WritingPractice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 写作提交事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingSubmittedEvent {
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 写作练习实体
     */
    private WritingPractice writingPractice;
}