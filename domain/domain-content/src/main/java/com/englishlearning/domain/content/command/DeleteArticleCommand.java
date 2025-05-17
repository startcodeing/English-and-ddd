package com.englishlearning.domain.content.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 删除文章命令
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteArticleCommand {
    
    /**
     * 文章ID
     */
    private String id;
    
    /**
     * 验证命令
     */
    public void validate() {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("文章ID不能为空");
        }
    }
}