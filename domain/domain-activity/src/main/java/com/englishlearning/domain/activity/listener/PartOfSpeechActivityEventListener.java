package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.vocabulary.event.*;
import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * 词性相关用户活动事件监听器
 * 基于Spring的事件监听机制，监听词性相关的领域事件，记录用户活动
 */
@Component
@Profile("spring-event-handler")
public class PartOfSpeechActivityEventListener {
    
    private final UserActivityService userActivityService;

    @Autowired
    public PartOfSpeechActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }
    
    /**
     * 监听词性创建事件
     */
    @EventListener
    public void handlePartOfSpeechCreatedEvent(PartOfSpeechCreatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_CREATED,
            "创建词性：" + event.getPartOfSpeech().getChineseMeaning(),
            event.getPartOfSpeech().getId(),
            "partofspeech"
        );
    }
    
    /**
     * 监听词性更新事件
     */
    @EventListener
    public void handlePartOfSpeechUpdatedEvent(PartOfSpeechUpdatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_UPDATED,
            "更新词性：" + event.getPartOfSpeech().getChineseMeaning(),
            event.getPartOfSpeech().getId(),
            "partofspeech"
        );
    }
    
    /**
     * 监听词性删除事件
     */
    @EventListener
    public void handlePartOfSpeechDeletedEvent(PartOfSpeechDeletedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_DELETED,
            "删除词性：" + event.getPartOfSpeech().getChineseMeaning(),
            event.getPartOfSpeech().getId(),
            "partofspeech"
        );
    }
    
    /**
     * 监听词性批量删除事件
     */
    @EventListener
    public void handlePartOfSpeechBatchDeletedEvent(PartOfSpeechBatchDeletedEvent event) {
        String posNames = event.getPartOfSpeeches().stream()
            .map(PartOfSpeech::getChineseMeaning)
            .collect(Collectors.joining(", "));
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_BATCH_DELETED,
            "批量删除词性：" + posNames,
            String.join(",", event.getPartOfSpeechIds()),
            "partofspeech"
        );
    }
}