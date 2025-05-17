package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 移除例句命令
 * 封装移除例句所需的参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemoveExampleSentenceCommand {
    
    /**
     * 单词ID
     */
    private String wordId;
    
    /**
     * 词性ID
     */
    private String partOfSpeechId;
    
    /**
     * 例句内容
     */
    private String sentence;
    
    /**
     * 验证命令
     * @throws IllegalArgumentException 如果参数无效
     */
    public void validate() {
        if (wordId == null || wordId.trim().isEmpty()) {
            throw new IllegalArgumentException("单词ID不能为空");
        }
        
        if (partOfSpeechId == null || partOfSpeechId.trim().isEmpty()) {
            throw new IllegalArgumentException("词性ID不能为空");
        }
        
        if (sentence == null || sentence.trim().isEmpty()) {
            throw new IllegalArgumentException("例句内容不能为空");
        }
    }
}