package com.englishlearning.domain.content.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 创建句子命令
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSentenceDomainDTO {
    
    /**
     * 英文内容
     */
    private String englishContent;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 语法分析
     */
    private String grammarAnalysis;
    
    /**
     * 验证命令
     */
    public void validate() {
        if (englishContent == null || englishContent.trim().isEmpty()) {
            throw new IllegalArgumentException("句子英文内容不能为空");
        }
        if (chineseMeaning == null || chineseMeaning.trim().isEmpty()) {
            throw new IllegalArgumentException("句子中文内容不能为空");
        }
        if (grammarAnalysis == null || grammarAnalysis.trim().isEmpty()) {
            throw new IllegalArgumentException("句子语法分析内容不能为空");
        }
    }
}