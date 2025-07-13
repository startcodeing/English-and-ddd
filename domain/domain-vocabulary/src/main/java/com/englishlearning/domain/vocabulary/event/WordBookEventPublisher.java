package com.englishlearning.domain.vocabulary.event;

/**
 * 单词本事件发布器接口
 */
public interface WordBookEventPublisher {
    
    /**
     * 发布单词本创建事件
     */
    void publishWordBookCreatedEvent(WordBookCreatedEvent event);
    
    /**
     * 发布单词本更新事件
     */
    void publishWordBookUpdatedEvent(WordBookUpdatedEvent event);
    
    /**
     * 发布单词本删除事件
     */
    void publishWordBookDeletedEvent(WordBookDeletedEvent event);
    
    /**
     * 发布单词本批量删除事件
     */
    void publishWordBookBatchDeletedEvent(WordBookBatchDeletedEvent event);
}