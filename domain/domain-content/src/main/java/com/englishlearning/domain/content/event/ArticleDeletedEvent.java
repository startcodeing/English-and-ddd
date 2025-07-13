package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文章删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的文章
     */
    private Article article;
}