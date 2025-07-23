package com.englishlearning.domain.practice.event;

import com.englishlearning.domain.practice.model.entity.WritingPractice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 写作练习评分事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingScoredEvent {
    
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
    
    /**
     * 得分
     */
    private Integer score;
}