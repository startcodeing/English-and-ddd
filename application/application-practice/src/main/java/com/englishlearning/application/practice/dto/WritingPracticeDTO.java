package com.englishlearning.application.practice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 写作练习数据传输对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingPracticeDTO {
    
    /**
     * ID
     */
    private Long id;
    
    /**
     * 关联的写作主题ID
     */
    private Long topicId;
    
    /**
     * 状态：draft-草稿，published-已提交
     */
    private String status;
    
    /**
     * 写作内容
     */
    private String content;
    
    /**
     * 得分
     */
    private Integer score;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
}