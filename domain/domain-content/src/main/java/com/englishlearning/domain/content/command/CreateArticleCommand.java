package com.englishlearning.domain.content.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 创建文章命令
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateArticleCommand {
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 全文内容
     */
    private String content;
    
    /**
     * 文章出处
     */
    private String source;
    
    /**
     * 作者
     */
    private String author;
    
    /**
     * 发布日期
     */
    private LocalDateTime publishDate;
    
    /**
     * 难度级别 (1-10)
     */
    private Integer difficultyLevel;
    
    /**
     * 验证命令
     */
    public void validate() {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("文章标题不能为空");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("文章内容不能为空");
        }
        if (difficultyLevel != null && (difficultyLevel < 1 || difficultyLevel > 10)) {
            throw new IllegalArgumentException("难度级别必须在1-10之间");
        }
    }
}