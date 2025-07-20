package com.englishlearning.application.practice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 写作练习查询参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingPracticeQueryDTO {
    
    /**
     * 状态：draft-草稿，published-已提交
     */
    private String status;
    
    /**
     * 关联的写作主题ID
     */
    private Long topicId;
    
    /**
     * 页码
     */
    private Integer pageNum;
    
    /**
     * 每页大小
     */
    private Integer pageSize;
}