package com.englishlearning.domain.practice.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 听写练习实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DictationPractice {
    
    /**
     * ID
     */
    private Long id;
    
    /**
     * 关联的听力资料ID
     */
    private Long listenMaterialId;
    
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
    
    /**
     * 创建听写练习
     */
    public void create() {
        this.status = "draft";
        this.score = 0;
        this.createTime = LocalDateTime.now();
        this.updateTime = this.createTime;
    }
    
    /**
     * 更新听写练习
     * 
     * @param content 听写内容
     */
    public void update(String content) {
        this.content = content;
        this.updateTime = LocalDateTime.now();
    }
    
    /**
     * 提交听写练习
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