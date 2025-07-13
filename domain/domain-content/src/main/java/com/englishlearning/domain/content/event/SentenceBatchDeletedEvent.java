package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.Sentence;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 句子批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentenceBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的句子ID列表
     */
    private List<String> sentenceIds;
    
    /**
     * 被删除的句子列表
     */
    private List<Sentence> sentences;
}