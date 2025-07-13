package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.vocabulary.event.WordCreatedEvent;
import com.englishlearning.domain.vocabulary.event.WordUpdatedEvent;
import com.englishlearning.domain.vocabulary.event.WordDeletedEvent;
import com.englishlearning.domain.vocabulary.event.WordMeaningAddedEvent;
import com.englishlearning.domain.content.event.SentenceCreatedEvent;
import com.englishlearning.domain.content.event.ArticleCreatedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * 用户活动事件监听器
 * 监听系统中的领域事件，记录用户活动
 */
@Component
public class UserActivityEventListener {
    
    private final UserActivityService userActivityService;
    
    @Autowired
    public UserActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }
    
    /**
     * 监听单词创建事件
     */
    @EventListener
    public void handleWordCreatedEvent(WordCreatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_CREATED,
            "创建单词：" + event.getWord().getSpelling(),
            event.getWord().getId(),
            "word"
        );
    }
    
    /**
     * 监听单词更新事件
     */
    @EventListener
    public void handleWordUpdatedEvent(WordUpdatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_UPDATED,
            "更新单词：" + event.getWord().getSpelling(),
            event.getWord().getId(),
            "word"
        );
    }
    
    /**
     * 监听单词删除事件
     */
    @EventListener
    public void handleWordDeletedEvent(WordDeletedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_DELETED,
            "删除单词：" + event.getWord().getSpelling(),
            event.getWord().getId(),
            "word"
        );
    }
    
    /**
     * 监听单词词义添加事件
     */
    @EventListener
    public void handleWordMeaningAddedEvent(WordMeaningAddedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_MEANING_ADDED,
            "添加词义：" + event.getWord().getSpelling(),
            event.getWord().getId(),
            "word"
        );
    }
    
    /**
     * 监听句子创建事件
     */
    @EventListener
    public void handleSentenceCreatedEvent(SentenceCreatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_CREATED,
            "创建句子",
            event.getSentence().getId(),
            "sentence"
        );
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
}