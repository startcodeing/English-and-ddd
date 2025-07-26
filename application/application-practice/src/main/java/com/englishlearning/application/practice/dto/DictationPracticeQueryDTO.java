package com.englishlearning.application.practice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 听写练习查询参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DictationPracticeQueryDTO {
    
    /**
     * 状态：draft-草稿，published-已提交
     */
    private String status;
    
    /**
     * 关联的听力资料ID
     */
    private Long listenMaterialId;
    
    /**
     * 页码
     */
    private Integer pageNum;
    
    /**
     * 每页大小
     */
    private Integer pageSize;
}