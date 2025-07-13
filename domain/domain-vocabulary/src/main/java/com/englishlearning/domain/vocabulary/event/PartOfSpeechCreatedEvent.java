package com.englishlearning.domain.vocabulary.event;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 词性创建事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartOfSpeechCreatedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 创建的词性
     */
    private PartOfSpeech partOfSpeech;
}