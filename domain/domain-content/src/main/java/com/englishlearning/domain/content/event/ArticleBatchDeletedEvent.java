package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 文章批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的文章ID列表
     */
    private List<String> articleIds;
    
    /**
     * 被删除的文章列表
     */
    private List<Article> articles;
}