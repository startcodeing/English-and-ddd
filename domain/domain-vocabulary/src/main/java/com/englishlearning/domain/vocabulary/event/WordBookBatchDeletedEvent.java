package com.englishlearning.domain.vocabulary.event;

import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 单词本批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WordBookBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的单词本ID列表
     */
    private List<String> wordBookIds;
    
    /**
     * 被删除的单词本列表
     */
    private List<WordBook> wordBooks;
}