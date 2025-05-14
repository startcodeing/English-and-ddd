package com.englishlearning.infrastructure.event.content;

import com.englishlearning.domain.content.event.SentenceCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.eventhandling.EventBus;
import org.axonframework.eventhandling.GenericEventMessage;
import org.springframework.stereotype.Component;

/**
 * 句子事件发布器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SentenceEventPublisher {
    
    private final EventBus eventBus;
    
    /**
     * 发布句子创建事件
     */
    public void publishSentenceCreatedEvent(SentenceCreatedEvent event) {
        log.info("Publishing sentence created event: {}", event);
        eventBus.publish(GenericEventMessage.asEventMessage(event));
    }
} 