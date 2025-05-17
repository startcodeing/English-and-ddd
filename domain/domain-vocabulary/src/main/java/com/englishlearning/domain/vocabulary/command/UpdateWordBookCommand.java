package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 更新单词本命令
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateWordBookCommand {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 名称
     */
    private String name;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 验证命令
     */
    public void validate() {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("单词本ID不能为空");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("单词本名称不能为空");
        }
    }
}