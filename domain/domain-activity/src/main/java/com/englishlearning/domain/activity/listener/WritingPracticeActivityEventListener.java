package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.practice.event.WritingBatchDeletedEvent;
import com.englishlearning.domain.practice.event.WritingCreatedEvent;
import com.englishlearning.domain.practice.event.WritingDeletedEvent;
import com.englishlearning.domain.practice.event.WritingScoredEvent;
import com.englishlearning.domain.practice.event.WritingSubmittedEvent;
import com.englishlearning.domain.practice.event.WritingUpdatedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 写作练习活动模块用户活动事件监听器
 * 基于Spring的事件监听机制，监听写作练习模块的领域事件，记录用户活动
 */
@Component
@Profile("spring-event-handler")
public class WritingPracticeActivityEventListener {
    
    private final UserActivityService userActivityService;

    @Autowired
    public WritingPracticeActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }
    
    /**
     * 监听写作练习创建事件
     */
    @EventListener
    public void handleWritingCreatedEvent(WritingCreatedEvent event) {
        userActivityService.recordActivity(
            String.valueOf(event.getUserId()),
            event.getUsername(),
            ActivityType.WRITING_SUBMITTED, // 使用WRITING_SUBMITTED作为活动类型
            "创建写作练习",
            "创建了一篇新的写作练习，主题ID：" + event.getWritingPractice().getTopicId(),
            String.valueOf(event.getWritingPractice().getId()),
            "writingpractice"
        );
    }
    
    /**
     * 监听写作练习更新事件
     */
    @EventListener
    public void handleWritingUpdatedEvent(WritingUpdatedEvent event) {
        userActivityService.recordActivity(
            String.valueOf(event.getUserId()),
            event.getUsername(),
            ActivityType.WRITING_SUBMITTED, // 使用WRITING_SUBMITTED作为活动类型
            "更新写作练习",
            "更新了写作练习内容，主题ID：" + event.getWritingPractice().getTopicId(),
            String.valueOf(event.getWritingPractice().getId()),
            "writingpractice"
        );
    }
    
    /**
     * 监听写作练习删除事件
     */
    @EventListener
    public void handleWritingDeletedEvent(WritingDeletedEvent event) {
        userActivityService.recordActivity(
            String.valueOf(event.getUserId()),
            event.getUsername(),
            ActivityType.WRITING_SUBMITTED, // 使用WRITING_SUBMITTED作为活动类型
            "删除写作练习",
            "删除了一篇写作练习",
            String.valueOf(event.getWritingPracticeId()),
            "writingpractice"
        );
    }
    
    /**
     * 监听写作练习批量删除事件
     */
    @EventListener
    public void handleWritingBatchDeletedEvent(WritingBatchDeletedEvent event) {
        String idsStr = event.getWritingPracticeIds().stream()
            .map(String::valueOf)
            .collect(Collectors.joining(", "));
            
        userActivityService.recordActivity(
            String.valueOf(event.getUserId()),
            event.getUsername(),
            ActivityType.WRITING_SUBMITTED, // 使用WRITING_SUBMITTED作为活动类型
            "批量删除写作练习",
            "批量删除了写作练习，ID：" + idsStr,
            String.join(",", event.getWritingPracticeIds().stream().map(String::valueOf).toArray(String[]::new)),
            "writingpractice"
        );
    }
    
    /**
     * 监听写作提交事件
     */
    @EventListener
    public void handleWritingSubmittedEvent(WritingSubmittedEvent event) {
        userActivityService.recordActivity(
            String.valueOf(event.getUserId()),
            event.getUsername(),
            ActivityType.WRITING_SUBMITTED,
            "提交写作练习",
            "提交了一篇写作练习，主题ID：" + event.getWritingPractice().getTopicId(),
            String.valueOf(event.getWritingPractice().getId()),
            "writingpractice"
        );
    }
    
    /**
     * 监听写作评分事件
     */
    @EventListener
    public void handleWritingScoredEvent(WritingScoredEvent event) {
        userActivityService.recordActivity(
            String.valueOf(event.getUserId()),
            event.getUsername(),
            ActivityType.WRITING_SUBMITTED, // 使用WRITING_SUBMITTED作为活动类型
            "写作练习评分",
            "写作练习获得评分：" + event.getScore() + "分",
            String.valueOf(event.getWritingPractice().getId()),
            "writingpractice"
        );
    }
}