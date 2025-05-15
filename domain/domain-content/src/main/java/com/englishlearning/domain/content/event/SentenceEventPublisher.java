package com.englishlearning.domain.content.event;

public interface SentenceEventPublisher {
    void publishSentenceCreatedEvent(SentenceCreatedEvent event);
    void publishSentenceUpdatedEvent(SentenceUpdatedEvent event);
    void publishSentenceDeletedEvent(String sentenceId);
}