package com.englishlearning.infrastructure.event.content;

import com.englishlearning.domain.content.event.*;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 听力资料事件发布器实现
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ListeningMaterialEventPublisherImpl implements ListeningMaterialEventPublisher {

    private DomainEventPublisher eventBus;

    @Autowired
    public ListeningMaterialEventPublisherImpl(DomainEventPublisher eventBus) {
        this.eventBus = eventBus;
    }

    @Override
    public void publishListeningMaterialCreatedEvent(ListeningMaterialCreatedEvent event) {
        log.info("Publishing listening material created event: {}", event);
        eventBus.publish(event);
    }

    @Override
    public void publishListeningMaterialUpdatedEvent(ListeningMaterialUpdatedEvent event) {
        log.info("Publishing listening material updated event: {}", event);
        eventBus.publish(event);
    }

    @Override
    public void publishListeningMaterialDeletedEvent(ListeningMaterialDeletedEvent event) {
        log.info("Publishing listening material deleted event: {}", event);
        eventBus.publish(event);
    }

    @Override
    public void publishListeningMaterialBatchDeletedEvent(ListeningMaterialBatchDeletedEvent event) {
        log.info("Publishing listening material batch deleted event: {}", event);
        eventBus.publish(event);
    }
}