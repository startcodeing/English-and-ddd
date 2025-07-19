package com.englishlearning.application.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 写作主题DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingTopicDTO {
    
    /**
     * ID
     */
    private Long id;
    
    /**
     * 主题描述
     */
    @NotBlank(message = "主题描述不能为空")
    private String description;
    
    /**
     * 题目来源
     */
    @NotBlank(message = "题目来源不能为空")
    private String source;
    
    /**
     * 难度级别
     */
    @NotNull(message = "难度级别不能为空")
    private String difficulty; // easy, medium, hard
    
    /**
     * 字数限制
     */
    @NotNull(message = "字数限制不能为空")
    @Min(value = 1, message = "字数限制必须大于0")
    private Integer wordLimit;
    
    /**
     * 时间限制（分钟）
     */
    private Integer timeLimit;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
}