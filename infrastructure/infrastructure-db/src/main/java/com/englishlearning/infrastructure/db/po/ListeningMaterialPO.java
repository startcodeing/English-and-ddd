package com.englishlearning.infrastructure.db.po;

import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 听力资料持久化对象
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "listening_material")
public class ListeningMaterialPO {
    
    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 资料标题
     */
    @Column(nullable = false, length = 100)
    private String title;
    
    /**
     * 听力原文
     */
    @Column(columnDefinition = "TEXT")
    private String originContent;
    
    /**
     * 难度级别
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficulty;
    
    /**
     * 音频文件路径
     */
    @Column(nullable = false)
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