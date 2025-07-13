package com.englishlearning.domain.vocabulary.event;

/**
 * 词性事件发布器接口
 */
public interface PartOfSpeechEventPublisher {
    
    /**
     * 发布词性创建事件
     */
    void publishPartOfSpeechCreatedEvent(PartOfSpeechCreatedEvent event);
    
    /**
     * 发布词性更新事件
     */
    void publishPartOfSpeechUpdatedEvent(PartOfSpeechUpdatedEvent event);
    
    /**
     * 发布词性删除事件
     */
    void publishPartOfSpeechDeletedEvent(PartOfSpeechDeletedEvent event);
    
    /**
     * 发布词性批量删除事件
     */
    void publishPartOfSpeechBatchDeletedEvent(PartOfSpeechBatchDeletedEvent event);
}