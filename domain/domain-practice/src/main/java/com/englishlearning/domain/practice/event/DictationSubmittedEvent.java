package com.englishlearning.domain.practice.event;

import com.englishlearning.domain.practice.model.entity.DictationPractice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 听写练习提交事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DictationSubmittedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 听写练习
     */
    private DictationPractice dictationPractice;
}