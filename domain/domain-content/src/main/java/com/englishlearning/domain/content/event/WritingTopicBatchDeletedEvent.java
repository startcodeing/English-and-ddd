package com.englishlearning.domain.content.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 写作主题批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingTopicBatchDeletedEvent {
    private List<Long> ids;
}