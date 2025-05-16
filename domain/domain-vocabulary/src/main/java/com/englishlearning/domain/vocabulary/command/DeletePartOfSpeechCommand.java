package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 删除词性命令
 * 封装删除词性所需的参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeletePartOfSpeechCommand {
    
    /**
     * 词性ID
     */
    private String id;
    
    /**
     * 验证命令
     * @throws IllegalArgumentException 如果参数无效
     */
    public void validate() {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("词性ID不能为空");
        }
    }
}