package com.englishlearning.domain.practice.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 写作练习实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingPractice {
    
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
    
    /**
     * 创建写作练习
     */
    public void create() {
        this.status = "draft";
        this.score = 0;
        this.createTime = LocalDateTime.now();
        this.updateTime = this.createTime;
    }
    
    /**
     * 更新写作练习
     * 
     * @param content 写作内容
     */
    public void update(String content) {
        this.content = content;
        this.updateTime = LocalDateTime.now();
    }
    
    /**
     * 提交写作练习
     */
    public void submit() {
        this.status = "published";
        this.updateTime = LocalDateTime.now();
    }
    
    /**
     * 评分
     * 
     * @param score 分数
     */
    public void score(Integer score) {
        this.score = score;
        this.updateTime = LocalDateTime.now();
    }
}