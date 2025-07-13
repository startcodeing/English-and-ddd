package com.englishlearning.infrastructure.event.publisher;

import org.axonframework.eventhandling.EventBus;
import org.axonframework.eventhandling.GenericEventMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * 基于Axon Framework的事件发布器实现
 */
@Component
@Profile("axon-event-handler")
public class AxonEventPublisher implements DomainEventPublisher {
    
    private EventBus eventBus;

    @Autowired(required = false)
    public void setEventBus(EventBus eventBus) {
        this.eventBus = eventBus;
    }
    
    @Override
    public void publish(Object event) {
        if (eventBus != null) {
            eventBus.publish(GenericEventMessage.asEventMessage(event));
        } else {
            // 当EventBus不可用时，记录日志或者什么都不做
            System.out.println("EventBus is not available, event not published: " + event);
        }
    }
}