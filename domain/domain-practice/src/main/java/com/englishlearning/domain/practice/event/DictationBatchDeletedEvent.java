package com.englishlearning.domain.practice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 听写练习批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DictationBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 听写练习ID列表
     */
    private List<Long> dictationPracticeIds;
}