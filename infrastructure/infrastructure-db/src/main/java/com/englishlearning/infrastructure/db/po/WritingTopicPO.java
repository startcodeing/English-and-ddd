package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 写作主题持久化对象
 */
@Data
@Entity
@Table(name = "t_writing_topic")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingTopicPO {
    
    /**
     * ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 主题描述
     */
    @Column(nullable = false)
    @Lob
    private String description;
    
    /**
     * 题目来源
     */
    @Column(length = 100)
    private String source;
    
    /**
     * 难度级别
     */
    @Column(name = "difficulty_level", nullable = false)
    private String difficulty;
    
    /**
     * 字数限制
     */
    @Column(name = "word_limit")
    private Integer wordLimit;
    
    /**
     * 时间限制（分钟）
     */
    @Column(name = "time_limit")
    private Integer timeLimit;
    
    /**
     * 创建时间
     */
    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime;
}