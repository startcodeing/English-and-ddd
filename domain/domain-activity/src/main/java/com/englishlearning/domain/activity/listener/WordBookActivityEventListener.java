package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.vocabulary.event.*;
import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * 单词本相关用户活动事件监听器
 * 基于Spring的事件监听机制，监听单词本相关的领域事件，记录用户活动
 */
@Component
@Profile("spring-event-handler")
public class WordBookActivityEventListener {
    
    private final UserActivityService userActivityService;

    @Autowired
    public WordBookActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }
    
    /**
     * 监听单词本创建事件
     */
    @EventListener
    public void handleWordBookCreatedEvent(WordBookCreatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_CREATED,
            "创建单词本：" + event.getWordBook().getName(),
            event.getWordBook().getId(),
            "wordbook"
        );
    }
    
    /**
     * 监听单词本更新事件
     */
    @EventListener
    public void handleWordBookUpdatedEvent(WordBookUpdatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_UPDATED,
            "更新单词本：" + event.getWordBook().getName(),
            event.getWordBook().getId(),
            "wordbook"
        );
    }
    
    /**
     * 监听单词本删除事件
     */
    @EventListener
    public void handleWordBookDeletedEvent(WordBookDeletedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_DELETED,
            "删除单词本：" + event.getWordBook().getName(),
            event.getWordBook().getId(),
            "wordbook"
        );
    }
    
    /**
     * 监听单词本批量删除事件
     */
    @EventListener
    public void handleWordBookBatchDeletedEvent(WordBookBatchDeletedEvent event) {
        String wordBookNames = event.getWordBooks().stream()
            .map(WordBook::getName)
            .collect(Collectors.joining(", "));
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_BATCH_DELETED,
            "批量删除单词本：" + wordBookNames,
            String.join(",", event.getWordBookIds()),
            "wordbook"
        );
    }
}