package com.englishlearning.domain.vocabulary.event;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 词性批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartOfSpeechBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的词性ID列表
     */
    private List<String> partOfSpeechIds;
    
    /**
     * 被删除的词性列表
     */
    private List<PartOfSpeech> partOfSpeeches;
}