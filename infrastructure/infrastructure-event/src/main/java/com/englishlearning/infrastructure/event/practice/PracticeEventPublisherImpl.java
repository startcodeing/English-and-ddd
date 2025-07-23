package com.englishlearning.infrastructure.event.practice;

import com.englishlearning.domain.practice.event.*;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 练习事件发布器实现
 */
@Slf4j
@Component
public class PracticeEventPublisherImpl implements PracticeEventPublisher {
    
    private DomainEventPublisher eventBus;
    
    @Autowired
    public void setEventBus(DomainEventPublisher eventBus) {
        this.eventBus = eventBus;
    }
    
    @Override
    public void publishWritingCreatedEvent(WritingCreatedEvent event) {
        log.info("Publishing writing created event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWritingUpdatedEvent(WritingUpdatedEvent event) {
        log.info("Publishing writing updated event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWritingDeletedEvent(WritingDeletedEvent event) {
        log.info("Publishing writing deleted event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWritingBatchDeletedEvent(WritingBatchDeletedEvent event) {
        log.info("Publishing writing batch deleted event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWritingSubmittedEvent(WritingSubmittedEvent event) {
        log.info("Publishing writing submitted event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWritingScoredEvent(WritingScoredEvent event) {
        log.info("Publishing writing scored event: {}", event);
        eventBus.publish(event);
    }
}