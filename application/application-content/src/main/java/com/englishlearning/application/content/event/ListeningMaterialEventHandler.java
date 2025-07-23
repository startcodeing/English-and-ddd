package com.englishlearning.application.content.event;

import com.englishlearning.domain.content.event.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * 听力资料事件处理器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ListeningMaterialEventHandler {

    /**
     * 处理听力资料创建事件
     *
     * @param event 听力资料创建事件
     */
    @EventListener
    public void handleListeningMaterialCreatedEvent(ListeningMaterialCreatedEvent event) {
        log.info("Handling listening material created event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理听力资料更新事件
     *
     * @param event 听力资料更新事件
     */
    @EventListener
    public void handleListeningMaterialUpdatedEvent(ListeningMaterialUpdatedEvent event) {
        log.info("Handling listening material updated event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理听力资料删除事件
     *
     * @param event 听力资料删除事件
     */
    @EventListener
    public void handleListeningMaterialDeletedEvent(ListeningMaterialDeletedEvent event) {
        log.info("Handling listening material deleted event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理听力资料批量删除事件
     *
     * @param event 听力资料批量删除事件
     */
    @EventListener
    public void handleListeningMaterialBatchDeletedEvent(ListeningMaterialBatchDeletedEvent event) {
        log.info("Handling listening material batch deleted event: {}", event);
        // 在这里添加业务逻辑
    }
}