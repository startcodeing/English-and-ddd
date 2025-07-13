package com.englishlearning.infrastructure.event.vocabulary;

import com.englishlearning.domain.vocabulary.event.PartOfSpeechCreatedEvent;
import com.englishlearning.domain.vocabulary.event.PartOfSpeechDeletedEvent;
import com.englishlearning.domain.vocabulary.event.PartOfSpeechEventPublisher;
import com.englishlearning.domain.vocabulary.event.PartOfSpeechUpdatedEvent;
import com.englishlearning.domain.vocabulary.event.PartOfSpeechBatchDeletedEvent;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 词性事件发布器实现
 */
@Slf4j
@Component
public class PartOfSpeechEventPublisherImpl implements PartOfSpeechEventPublisher {
    
    private DomainEventPublisher eventBus;
    
    @Autowired
    public void setEventBus(DomainEventPublisher eventBus) {
        this.eventBus = eventBus;
    }
    
    @Override
    public void publishPartOfSpeechCreatedEvent(PartOfSpeechCreatedEvent event) {
        log.info("Publishing part of speech created event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishPartOfSpeechUpdatedEvent(PartOfSpeechUpdatedEvent event) {
        log.info("Publishing part of speech updated event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishPartOfSpeechDeletedEvent(PartOfSpeechDeletedEvent event) {
        log.info("Publishing part of speech deleted event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishPartOfSpeechBatchDeletedEvent(PartOfSpeechBatchDeletedEvent event) {
        log.info("Publishing part of speech batch deleted event: {}", event);
        eventBus.publish(event);
    }
}