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
}