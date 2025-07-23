package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.content.event.SentenceCreatedEvent;
import com.englishlearning.domain.content.event.SentenceUpdatedEvent;
import com.englishlearning.domain.content.event.SentenceDeletedEvent;
import com.englishlearning.domain.content.event.SentenceBatchDeletedEvent;
import com.englishlearning.domain.content.model.entity.Sentence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * 句子相关用户活动事件监听器
 * 基于Spring的事件监听机制，监听句子相关的领域事件，记录用户活动
 */
@Component
@Profile("spring-event-handler")
public class SentenceActivityEventListener {

    private final UserActivityService userActivityService;

    @Autowired
    public SentenceActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
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
            "创建句子：" + event.getSentence().getEnglishContent(),
            event.getSentence().getId(),
            "sentence"
        );
    }
    
    /**
     * 监听句子更新事件
     */
    @EventListener
    public void handleSentenceUpdatedEvent(SentenceUpdatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_UPDATED,
            "更新句子：" + event.getSentence().getEnglishContent(),
            event.getSentence().getId(),
            "sentence"
        );
    }
    
    /**
     * 监听句子删除事件
     */
    @EventListener
    public void handleSentenceDeletedEvent(SentenceDeletedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_DELETED,
            "删除句子：" + event.getSentence().getEnglishContent(),
            event.getSentence().getId(),
            "sentence"
        );
    }
    
    /**
     * 监听句子批量删除事件
     */
    @EventListener
    public void handleSentenceBatchDeletedEvent(SentenceBatchDeletedEvent event) {
        String sentenceTexts = event.getSentences().stream()
            .map(Sentence::getEnglishContent)
            .collect(Collectors.joining(", "));

        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_BATCH_DELETED,
            "批量删除句子：" + sentenceTexts,
            String.join(",", event.getSentenceIds()),
            "sentence"
        );
    }
}