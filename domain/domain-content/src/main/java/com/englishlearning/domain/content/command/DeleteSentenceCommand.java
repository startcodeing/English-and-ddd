package com.englishlearning.domain.content.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 删除句子命令
 * 封装删除句子所需的参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteSentenceCommand {
    
    /**
     * 句子ID
     */
    private String id;
    
    /**
     * 验证命令
     * @throws IllegalArgumentException 如果参数无效
     */
    public void validate() {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("句子ID不能为空");
        }
    }
}