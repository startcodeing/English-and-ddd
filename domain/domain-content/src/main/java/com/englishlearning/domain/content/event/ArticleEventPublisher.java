package com.englishlearning.domain.content.event;

public interface ArticleEventPublisher {
    void publishArticleCreatedEvent(ArticleCreatedEvent event);
    void publishArticleUpdatedEvent(ArticleUpdatedEvent event);
    void publishArticleDeletedEvent(String sentenceId);
}