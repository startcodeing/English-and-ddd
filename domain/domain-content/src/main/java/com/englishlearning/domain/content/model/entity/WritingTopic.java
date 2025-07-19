package com.englishlearning.domain.content.model.entity;

import com.englishlearning.domain.content.dto.CreateWritingTopicDTO;
import com.englishlearning.domain.content.dto.UpdateWritingTopicDTO;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 写作主题实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingTopic {
    
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
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
    
    /**
     * 创建写作主题
     * @param command 创建写作主题命令
     */
    public void create(CreateWritingTopicDTO command) {
        this.description = command.getDescription();
        this.source = command.getSource();
        this.difficulty = command.getDifficulty();
        this.wordLimit = command.getWordLimit();
        this.timeLimit = command.getTimeLimit();
        this.createTime = LocalDateTime.now();
        this.updateTime = this.createTime;
    }
    
    /**
     * 更新写作主题
     * @param command 更新写作主题命令
     */
    public void update(UpdateWritingTopicDTO command) {
        if (command.getDescription() != null) {
            this.description = command.getDescription();
        }
        if (command.getSource() != null) {
            this.source = command.getSource();
        }
        if (command.getDifficulty() != null) {
            this.difficulty = command.getDifficulty();
        }
        if (command.getWordLimit() != null) {
            this.wordLimit = command.getWordLimit();
        }
        if (command.getTimeLimit() != null) {
            this.timeLimit = command.getTimeLimit();
        }
        this.updateTime = LocalDateTime.now();
    }
}