package com.englishlearning.infrastructure.event.content;

import com.englishlearning.domain.content.event.*;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 语法分析事件发布器实现
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GrammarAnalysisEventPublisherImpl implements GrammarAnalysisEventPublisher {

    private DomainEventPublisher eventBus;

    @Autowired
    public GrammarAnalysisEventPublisherImpl(DomainEventPublisher eventBus) {
        this.eventBus = eventBus;
    }

    @Override
    public void publishGrammarAnalysisCreatedEvent(GrammarAnalysisCreatedEvent event) {
        log.info("Publishing grammar analysis created event: {}", event);
        eventBus.publish(event);
    }

    @Override
    public void publishGrammarAnalysisUpdatedEvent(GrammarAnalysisUpdatedEvent event) {
        log.info("Publishing grammar analysis updated event: {}", event);
        eventBus.publish(event);
    }

    @Override
    public void publishGrammarAnalysisDeletedEvent(GrammarAnalysisDeletedEvent event) {
        log.info("Publishing grammar analysis deleted event: {}", event);
        eventBus.publish(event);
    }

    @Override
    public void publishGrammarAnalysisBatchDeletedEvent(GrammarAnalysisBatchDeletedEvent event) {
        log.info("Publishing grammar analysis batch deleted event: {}", event);
        eventBus.publish(event);
    }
}