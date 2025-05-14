package com.englishlearning.infrastructure.event.content;

import com.englishlearning.domain.content.event.ArticleCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.eventhandling.EventBus;
import org.axonframework.eventhandling.GenericEventMessage;
import org.springframework.stereotype.Component;

/**
 * 文章事件发布器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ArticleEventPublisher {
    
    private final EventBus eventBus;
    
    /**
     * 发布文章创建事件
     */
    public void publishArticleCreatedEvent(ArticleCreatedEvent event) {
        log.info("Publishing article created event: {}", event);
        eventBus.publish(GenericEventMessage.asEventMessage(event));
    }
} 