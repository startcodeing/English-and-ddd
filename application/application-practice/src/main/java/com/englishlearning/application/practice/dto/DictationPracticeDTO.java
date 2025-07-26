package com.englishlearning.application.practice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 听写练习DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DictationPracticeDTO {
    
    /**
     * ID
     */
    private Long id;
    
    /**
     * 关联的听力资料ID
     */
    private Long listenMaterialId;
    
    /**
     * 听力资料标题（用于显示）
     */
    private String listenMaterialTitle;
    
    /**
     * 听力资料难度（用于显示）
     */
    private String listenMaterialDifficulty;
    
    /**
     * 状态：draft-草稿，published-已提交
     */
    private String status;
    
    /**
     * 听写内容
     */
    private String content;
    
    /**
     * 得分
     */
    private Integer score;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
}