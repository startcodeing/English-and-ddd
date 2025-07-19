package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.WritingTopic;

/**
 * 写作主题事件发布接口
 */
public interface WritingTopicEventPublisher {
    
    /**
     * 发布写作主题创建事件
     */
    void publishWritingTopicCreatedEvent(WritingTopic writingTopic);
    
    /**
     * 发布写作主题更新事件
     */
    void publishWritingTopicUpdatedEvent(WritingTopic writingTopic);
    
    /**
     * 发布写作主题删除事件
     */
    void publishWritingTopicDeletedEvent(Long id);
    
    /**
     * 发布写作主题批量删除事件
     */
    void publishWritingTopicBatchDeletedEvent(java.util.List<Long> ids);
}