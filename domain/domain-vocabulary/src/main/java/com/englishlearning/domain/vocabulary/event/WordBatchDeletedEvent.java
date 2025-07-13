package com.englishlearning.domain.vocabulary.event;

import com.englishlearning.domain.vocabulary.model.entity.Word;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 单词批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WordBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的单词ID列表
     */
    private List<String> wordIds;
    
    /**
     * 被删除的单词列表
     */
    private List<Word> words;
}