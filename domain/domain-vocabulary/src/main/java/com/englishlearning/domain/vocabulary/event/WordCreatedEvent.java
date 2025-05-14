package com.englishlearning.domain.vocabulary.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 单词创建事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WordCreatedEvent {
    
    /**
     * 单词ID
     */
    private String wordId;
    
    /**
     * 单词拼写
     */
    private String spelling;
    
    /**
     * 词性ID
     */
    private String partOfSpeechId;
} 