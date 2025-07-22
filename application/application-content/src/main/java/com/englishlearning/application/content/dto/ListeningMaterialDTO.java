package com.englishlearning.application.content.dto;

import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 听力资料数据传输对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListeningMaterialDTO {
    
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
    private String difficulty;
    
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