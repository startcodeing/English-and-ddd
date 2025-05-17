package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 删除单词本命令
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteWordBookCommand {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 验证命令
     */
    public void validate() {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("单词本ID不能为空");
        }
    }
}