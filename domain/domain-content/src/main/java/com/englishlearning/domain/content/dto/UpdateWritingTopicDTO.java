package com.englishlearning.domain.content.dto;

import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 更新写作主题DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateWritingTopicDTO {
    
    /**
     * ID
     */
    private Long id;
    
    /**
     * 主题描述
     */
    private String description;
    
    /**
     * 题目来源
     */
    private String source;
    
    /**
     * 难度级别
     */
    private DifficultyLevel difficulty;
    
    /**
     * 字数限制
     */
    private Integer wordLimit;
    
    /**
     * 时间限制（分钟）
     */
    private Integer timeLimit;
}