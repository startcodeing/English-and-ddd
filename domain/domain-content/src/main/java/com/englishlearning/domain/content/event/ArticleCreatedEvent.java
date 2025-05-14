package com.englishlearning.domain.content.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文章创建事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCreatedEvent {
    
    /**
     * 文章ID
     */
    private String articleId;
    
    /**
     * 文章标题
     */
    private String title;
    
    /**
     * 文章难度级别
     */
    private Integer difficultyLevel;
    
    /**
     * 文章句子数量
     */
    private Integer sentenceCount;
} 