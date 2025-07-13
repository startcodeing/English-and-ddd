package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文章更新事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleUpdatedEvent {
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 文章
     */
    private Article article;
}