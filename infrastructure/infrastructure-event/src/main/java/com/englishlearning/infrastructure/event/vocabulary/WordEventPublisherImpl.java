package com.englishlearning.infrastructure.event.vocabulary;

import com.englishlearning.domain.vocabulary.event.WordCreatedEvent;
import com.englishlearning.domain.vocabulary.event.WordDeletedEvent;
import com.englishlearning.domain.vocabulary.event.WordEventPublisher;
import com.englishlearning.domain.vocabulary.event.WordMeaningAddedEvent;
import com.englishlearning.domain.vocabulary.event.WordUpdatedEvent;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.eventhandling.EventBus;
import org.axonframework.eventhandling.GenericEventMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 单词事件发布器实现
 */
@Slf4j
@Component
public class WordEventPublisherImpl implements WordEventPublisher {
    
   // private EventBus eventBus;
   private DomainEventPublisher eventBus;
    
    @Autowired
    public void setEventBus(DomainEventPublisher eventBus) {
        this.eventBus = eventBus;
    }
    
    @Override
    public void publishWordCreatedEvent(WordCreatedEvent event) {
        log.info("Publishing word created event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWordUpdatedEvent(WordUpdatedEvent event) {
        log.info("Publishing word updated event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWordDeletedEvent(WordDeletedEvent event) {
        log.info("Publishing word deleted event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWordMeaningAddedEvent(WordMeaningAddedEvent event) {
        log.info("Publishing word meaning added event: {}", event);
        eventBus.publish(event);
    }
}