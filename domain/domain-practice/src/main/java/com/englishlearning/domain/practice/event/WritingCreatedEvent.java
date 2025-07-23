package com.englishlearning.domain.practice.event;

import com.englishlearning.domain.practice.model.entity.WritingPractice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 写作练习创建事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingCreatedEvent {
    
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