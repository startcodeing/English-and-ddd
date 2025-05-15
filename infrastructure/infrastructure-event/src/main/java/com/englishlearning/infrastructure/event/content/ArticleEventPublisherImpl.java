package com.englishlearning.infrastructure.event.content;

import com.englishlearning.domain.content.event.ArticleCreatedEvent;
import com.englishlearning.domain.content.event.ArticleUpdatedEvent;
import com.englishlearning.domain.content.event.ArticleEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.eventhandling.EventBus;
import org.axonframework.eventhandling.GenericEventMessage;
import org.springframework.stereotype.Component;

/**
 * 文章事件发布器实现
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ArticleEventPublisherImpl implements ArticleEventPublisher {
    
    private final EventBus eventBus;
    
    @Override
    public void publishArticleCreatedEvent(ArticleCreatedEvent event) {
        log.info("Publishing article created event: {}", event);
        eventBus.publish(GenericEventMessage.asEventMessage(event));
    }
    
    @Override
    public void publishArticleUpdatedEvent(ArticleUpdatedEvent event) {
        log.info("Publishing article updated event: {}", event);
        eventBus.publish(GenericEventMessage.asEventMessage(event));
    }
    
    @Override
    public void publishArticleDeletedEvent(String articleId) {
        log.info("Publishing article deleted event for id: {}", articleId);
        eventBus.publish(GenericEventMessage.asEventMessage(articleId));
    }
} 