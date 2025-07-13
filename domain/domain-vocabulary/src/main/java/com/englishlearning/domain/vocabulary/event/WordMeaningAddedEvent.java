package com.englishlearning.domain.vocabulary.event;

import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 单词词义添加事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WordMeaningAddedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 单词
     */
    private Word word;
    
    /**
     * 添加的词义
     */
    private WordMeaning wordMeaning;
}