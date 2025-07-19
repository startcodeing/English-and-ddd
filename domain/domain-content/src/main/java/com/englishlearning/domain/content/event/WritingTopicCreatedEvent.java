package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.WritingTopic;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 写作主题创建事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingTopicCreatedEvent {
    private WritingTopic writingTopic;
}