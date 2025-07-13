package com.englishlearning.infrastructure.event.content;

import com.englishlearning.domain.content.event.SentenceCreatedEvent;
import com.englishlearning.domain.content.event.SentenceDeletedEvent;
import com.englishlearning.domain.content.event.SentenceEventPublisher;
import com.englishlearning.domain.content.event.SentenceUpdatedEvent;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.eventhandling.EventBus;
import org.axonframework.eventhandling.GenericEventMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 句子事件发布器实现
 */
@Slf4j
@Component
public class SentenceEventPublisherImpl implements SentenceEventPublisher {
    
    //private EventBus eventBus;
    private DomainEventPublisher eventBus;
    
    @Autowired
    public void setEventBus(DomainEventPublisher eventBus) {
        this.eventBus = eventBus;
    }
    
    @Override
    public void publishSentenceCreatedEvent(SentenceCreatedEvent event) {
        log.info("Publishing sentence created event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishSentenceUpdatedEvent(SentenceUpdatedEvent event) {
        log.info("Publishing sentence updated event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishSentenceDeletedEvent(String sentenceId) {
        log.info("Publishing sentence deleted event for id: {}", sentenceId);
        eventBus.publish(sentenceId);
    }
    
    public void publishSentenceDeletedEvent(SentenceDeletedEvent event) {
        log.info("Publishing sentence deleted event: {}", event);
        eventBus.publish(event);
    }
}