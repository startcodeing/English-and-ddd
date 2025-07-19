package com.englishlearning.infrastructure.event.content;

import com.englishlearning.domain.content.event.WritingTopicBatchDeletedEvent;
import com.englishlearning.domain.content.event.WritingTopicCreatedEvent;
import com.englishlearning.domain.content.event.WritingTopicDeletedEvent;
import com.englishlearning.domain.content.event.WritingTopicEventPublisher;
import com.englishlearning.domain.content.event.WritingTopicUpdatedEvent;
import com.englishlearning.domain.content.model.entity.WritingTopic;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 写作主题事件发布器实现
 */
@Slf4j
@Component
public class WritingTopicEventPublisherImpl implements WritingTopicEventPublisher {
    
    private DomainEventPublisher eventBus;
    
    @Autowired
    public void setEventBus(DomainEventPublisher eventBus) {
        this.eventBus = eventBus;
    }
    
    @Override
    public void publishWritingTopicCreatedEvent(WritingTopic writingTopic) {
        WritingTopicCreatedEvent event = new WritingTopicCreatedEvent(writingTopic);
        log.info("Publishing writing topic created event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWritingTopicUpdatedEvent(WritingTopic writingTopic) {
        WritingTopicUpdatedEvent event = new WritingTopicUpdatedEvent(writingTopic);
        log.info("Publishing writing topic updated event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWritingTopicDeletedEvent(Long id) {
        WritingTopicDeletedEvent event = new WritingTopicDeletedEvent(id);
        log.info("Publishing writing topic deleted event: {}", event);
        eventBus.publish(event);
    }
    
    @Override
    public void publishWritingTopicBatchDeletedEvent(List<Long> ids) {
        WritingTopicBatchDeletedEvent event = new WritingTopicBatchDeletedEvent(ids);
        log.info("Publishing writing topic batch deleted event: {}", event);
        eventBus.publish(event);
    }
}