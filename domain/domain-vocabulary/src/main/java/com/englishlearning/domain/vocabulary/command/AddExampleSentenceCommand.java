package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 添加例句命令
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddExampleSentenceCommand {
    
    /**
     * 单词ID
     */
    private String wordId;
    
    /**
     * 词义ID
     */
    private String wordMeaningId;
    
    /**
     * 词性ID（兼容旧版本）
     * @deprecated 使用wordMeaningId替代
     */
    @Deprecated
    private String partOfSpeechId;
    
    /**
     * 例句内容
     */
    private String sentence;
    
    /**
     * 验证命令
     */
    public void validate() {
        if (wordId == null || wordId.trim().isEmpty()) {
            throw new IllegalArgumentException("单词ID不能为空");
        }
        
        // 检查词义ID或词性ID至少有一个不为空
        if ((wordMeaningId == null || wordMeaningId.trim().isEmpty()) && 
            (partOfSpeechId == null || partOfSpeechId.trim().isEmpty())) {
            throw new IllegalArgumentException("词义ID和词性ID不能同时为空");
        }
        
        if (sentence == null || sentence.trim().isEmpty()) {
            throw new IllegalArgumentException("例句内容不能为空");
        }
    }
}