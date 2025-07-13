package com.englishlearning.domain.vocabulary.event;

import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 单词本创建事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WordBookCreatedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 创建的单词本
     */
    private WordBook wordBook;
}