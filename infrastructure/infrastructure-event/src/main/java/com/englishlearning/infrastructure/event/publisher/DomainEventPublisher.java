package com.englishlearning.infrastructure.event.publisher;

/**
 * 领域事件发布器接口
 */
public interface DomainEventPublisher {
    
    /**
     * 发布领域事件
     *
     * @param event 领域事件
     */
    void publish(Object event);
} 