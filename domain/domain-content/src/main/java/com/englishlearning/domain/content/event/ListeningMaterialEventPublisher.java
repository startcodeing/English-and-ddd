package com.englishlearning.domain.content.event;

public interface ListeningMaterialEventPublisher {
    void publishListeningMaterialCreatedEvent(ListeningMaterialCreatedEvent event);
    void publishListeningMaterialUpdatedEvent(ListeningMaterialUpdatedEvent event);
    void publishListeningMaterialDeletedEvent(ListeningMaterialDeletedEvent event);
    void publishListeningMaterialBatchDeletedEvent(ListeningMaterialBatchDeletedEvent event);
}