package com.englishlearning.domain.vocabulary.event;

/**
 * 单词事件发布器接口
 */
public interface WordEventPublisher {
    
    /**
     * 发布单词创建事件
     */
    void publishWordCreatedEvent(WordCreatedEvent event);
    
    /**
     * 发布单词更新事件
     */
    void publishWordUpdatedEvent(WordUpdatedEvent event);
    
    /**
     * 发布单词删除事件
     */
    void publishWordDeletedEvent(WordDeletedEvent event);
    
    /**
     * 发布单词批量删除事件
     */
    void publishWordBatchDeletedEvent(WordBatchDeletedEvent event);
    
    /**
     * 发布单词词义添加事件
     */
    void publishWordMeaningAddedEvent(WordMeaningAddedEvent event);
}