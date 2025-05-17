package com.englishlearning.domain.content.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 更新句子命令
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSentenceCommand {
    
    /**
     * 句子ID
     */
    private String id;
    
    /**
     * 英文内容
     */
    private String englishContent;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 文章ID
     */
    private String articleId;
    
    /**
     * 语法分析
     */
    private String grammarAnalysis;
    
    /**
     * 验证命令
     */
    public void validate() {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("句子ID不能为空");
        }
        if (englishContent != null && englishContent.trim().isEmpty()) {
            throw new IllegalArgumentException("句子英文内容不能为空");
        }
    }
}