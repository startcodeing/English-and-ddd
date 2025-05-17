package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 添加例句命令
 * 封装添加例句所需的参数
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
        
        if (sentence == null || sentence.trim().isEmpty()) {
            throw new IllegalArgumentException("例句内容不能为空");
        }
    }
}