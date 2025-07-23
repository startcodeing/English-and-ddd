package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.vocabulary.event.*;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * 单词相关用户活动事件监听器
 * 基于Spring的事件监听机制，监听单词相关的领域事件，记录用户活动
 */
@Component
@Profile("spring-event-handler")
public class WordActivityEventListener {
    
    private final UserActivityService userActivityService;

    @Autowired
    public WordActivityEventListener(UserActivityService userActivityService) {
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
     * 监听单词批量删除事件
     */
    @EventListener
    public void handleWordBatchDeletedEvent(WordBatchDeletedEvent event) {
        String wordSpellings = event.getWords().stream()
            .map(Word::getSpelling)
            .collect(Collectors.joining(", "));
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BATCH_DELETED,
            "批量删除单词：" + wordSpellings,
            String.join(",", event.getWordIds()),
            "word"
        );
    }
}