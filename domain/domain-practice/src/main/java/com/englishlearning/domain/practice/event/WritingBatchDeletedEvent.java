package com.englishlearning.domain.practice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 写作练习批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 写作练习ID列表
     */
    private List<Long> writingPracticeIds;
}