package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 更新词性用法总结命令
 * 封装更新词性用法总结所需的参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePartOfSpeechUsageSummaryCommand {
    
    /**
     * 词性ID
     */
    private String id;
    
    /**
     * 用法总结
     */
    private String usageSummary;
    
    /**
     * 验证命令
     * @throws IllegalArgumentException 如果参数无效
     */
    public void validate() {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("词性ID不能为空");
        }
        
        if (usageSummary == null) {
            throw new IllegalArgumentException("用法总结不能为null");
        }
    }
}