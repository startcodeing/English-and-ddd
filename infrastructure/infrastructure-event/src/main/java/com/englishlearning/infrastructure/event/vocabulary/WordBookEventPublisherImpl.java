package com.englishlearning.infrastructure.event.vocabulary;

import com.englishlearning.domain.vocabulary.event.WordBookCreatedEvent;
import com.englishlearning.domain.vocabulary.event.WordBookDeletedEvent;
import com.englishlearning.domain.vocabulary.event.WordBookEventPublisher;
import com.englishlearning.domain.vocabulary.event.WordBookUpdatedEvent;
import com.englishlearning.domain.vocabulary.event.WordBookBatchDeletedEvent;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 单词本事件发布器实现
 */
@Slf4j
@Component
public class WordBookEventPublisherImpl implements WordBookEventPublisher {
    
    private DomainEventPublisher eventBus;
    
    @Autowired
    public void setEventBus(DomainEventPublisher eventBus) {
        this.eventBus = eventBus;
    }
    
    @Override
    public void publishWordBookCreatedEvent(WordBookCreatedEvent event) {
        log.info("Publishing word book created event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWordBookUpdatedEvent(WordBookUpdatedEvent event) {
        log.info("Publishing word book updated event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWordBookDeletedEvent(WordBookDeletedEvent event) {
        log.info("Publishing word book deleted event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWordBookBatchDeletedEvent(WordBookBatchDeletedEvent event) {
        log.info("Publishing word book batch deleted event: {}", event);
        eventBus.publish(event);
    }
}