package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.content.event.ArticleCreatedEvent;
import com.englishlearning.domain.content.event.ArticleUpdatedEvent;
import com.englishlearning.domain.content.event.ArticleDeletedEvent;
import com.englishlearning.domain.content.event.ArticleBatchDeletedEvent;
import com.englishlearning.domain.content.model.entity.Article;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * 文章相关用户活动事件监听器
 * 基于Spring的事件监听机制，监听文章相关的领域事件，记录用户活动
 */
@Component
@Profile("spring-event-handler")
public class ArticleActivityEventListener {

    private final UserActivityService userActivityService;

    @Autowired
    public ArticleActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    /**
     * 监听文章创建事件
     */
    @EventListener
    public void handleArticleCreatedEvent(ArticleCreatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_CREATED,
            "创建文章：" + event.getArticle().getTitle(),
            event.getArticle().getId(),
            "article"
        );
    }
    
    /**
     * 监听文章更新事件
     */
    @EventListener
    public void handleArticleUpdatedEvent(ArticleUpdatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_UPDATED,
            "更新文章：" + event.getArticle().getTitle(),
            event.getArticle().getId(),
            "article"
        );
    }
    
    /**
     * 监听文章删除事件
     */
    @EventListener
    public void handleArticleDeletedEvent(ArticleDeletedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_DELETED,
            "删除文章：" + event.getArticle().getTitle(),
            event.getArticle().getId(),
            "article"
        );
    }
    
    /**
     * 监听文章批量删除事件
     */
    @EventListener
    public void handleArticleBatchDeletedEvent(ArticleBatchDeletedEvent event) {
        String articleTitles = event.getArticles().stream()
            .map(Article::getTitle)
            .collect(Collectors.joining(", "));

        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_BATCH_DELETED,
            "批量删除文章：" + articleTitles,
            String.join(",", event.getArticleIds()),
            "article"
        );
    }
}