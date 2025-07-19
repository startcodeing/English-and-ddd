package com.englishlearning.domain.content.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 写作主题删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingTopicDeletedEvent {
    private Long id;
}