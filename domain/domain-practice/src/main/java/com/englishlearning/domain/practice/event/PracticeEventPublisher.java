package com.englishlearning.domain.practice.event;

/**
 * 练习事件发布器接口
 */
public interface PracticeEventPublisher {
    
    /**
     * 发布写作练习创建事件
     *
     * @param event 写作练习创建事件
     */
    void publishWritingCreatedEvent(WritingCreatedEvent event);
    
    /**
     * 发布写作练习更新事件
     *
     * @param event 写作练习更新事件
     */
    void publishWritingUpdatedEvent(WritingUpdatedEvent event);
    
    /**
     * 发布写作练习删除事件
     *
     * @param event 写作练习删除事件
     */
    void publishWritingDeletedEvent(WritingDeletedEvent event);
    
    /**
     * 发布写作练习批量删除事件
     *
     * @param event 写作练习批量删除事件
     */
    void publishWritingBatchDeletedEvent(WritingBatchDeletedEvent event);
    
    /**
     * 发布写作提交事件
     *
     * @param event 写作提交事件
     */
    void publishWritingSubmittedEvent(WritingSubmittedEvent event);
    
    /**
     * 发布写作评分事件
     *
     * @param event 写作评分事件
     */
    void publishWritingScoredEvent(WritingScoredEvent event);
    
    /**
     * 发布听写练习创建事件
     *
     * @param event 听写练习创建事件
     */
    void publishDictationCreatedEvent(DictationCreatedEvent event);
    
    /**
     * 发布听写练习更新事件
     *
     * @param event 听写练习更新事件
     */
    void publishDictationUpdatedEvent(DictationUpdatedEvent event);
    
    /**
     * 发布听写练习删除事件
     *
     * @param event 听写练习删除事件
     */
    void publishDictationDeletedEvent(DictationDeletedEvent event);
    
    /**
     * 发布听写练习批量删除事件
     *
     * @param event 听写练习批量删除事件
     */
    void publishDictationBatchDeletedEvent(DictationBatchDeletedEvent event);
    
    /**
     * 发布听写提交事件
     *
     * @param event 听写提交事件
     */
    void publishDictationSubmittedEvent(DictationSubmittedEvent event);
    
    /**
     * 发布听写评分事件
     *
     * @param event 听写评分事件
     */
    void publishDictationScoredEvent(DictationScoredEvent event);
}