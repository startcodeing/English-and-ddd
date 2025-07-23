package com.englishlearning.application.practice.event;

import com.englishlearning.domain.practice.event.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * 练习事件处理器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PracticeEventHandler {

    /**
     * 处理写作练习创建事件
     *
     * @param event 写作练习创建事件
     */
    @EventListener
    public void handleWritingCreatedEvent(WritingCreatedEvent event) {
        log.info("Handling writing created event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理写作练习更新事件
     *
     * @param event 写作练习更新事件
     */
    @EventListener
    public void handleWritingUpdatedEvent(WritingUpdatedEvent event) {
        log.info("Handling writing updated event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理写作练习删除事件
     *
     * @param event 写作练习删除事件
     */
    @EventListener
    public void handleWritingDeletedEvent(WritingDeletedEvent event) {
        log.info("Handling writing deleted event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理写作练习批量删除事件
     *
     * @param event 写作练习批量删除事件
     */
    @EventListener
    public void handleWritingBatchDeletedEvent(WritingBatchDeletedEvent event) {
        log.info("Handling writing batch deleted event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理写作提交事件
     *
     * @param event 写作提交事件
     */
    @EventListener
    public void handleWritingSubmittedEvent(WritingSubmittedEvent event) {
        log.info("Handling writing submitted event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理写作评分事件
     *
     * @param event 写作评分事件
     */
    @EventListener
    public void handleWritingScoredEvent(WritingScoredEvent event) {
        log.info("Handling writing scored event: {}", event);
        // 在这里添加业务逻辑
    }
}