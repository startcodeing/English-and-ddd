package com.englishlearning.domain.content.model.entity;

import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 听力资料实体类
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListeningMaterial {
    
    /**
     * 主键ID
     */
    private Long id;
    
    /**
     * 资料标题
     */
    private String title;
    
    /**
     * 听力原文
     */
    private String originContent;
    
    /**
     * 难度级别
     */
    private DifficultyLevel difficulty;
    
    /**
     * 音频文件路径
     */
    private String audioPath;
    
    /**
     * 文件大小（字节）
     */
    private Long fileSize;
    
    /**
     * 音频时长（秒）
     */
    private Long durationInSeconds;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
}