package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 从单词本移除单词命令
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemoveWordFromWordBookCommand {
    
    /**
     * 单词本ID
     */
    private String wordBookId;
    
    /**
     * 单词ID
     */
    private String wordId;
    
    /**
     * 验证命令
     */
    public void validate() {
        if (wordBookId == null || wordBookId.trim().isEmpty()) {
            throw new IllegalArgumentException("单词本ID不能为空");
        }
        if (wordId == null || wordId.trim().isEmpty()) {
            throw new IllegalArgumentException("单词ID不能为空");
        }
    }
}