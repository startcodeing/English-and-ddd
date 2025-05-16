package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 更新词性命令
 * 封装更新词性所需的参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePartOfSpeechCommand {
    
    /**
     * 词性ID
     */
    private String id;
    
    /**
     * 英文名称
     */
    private String englishName;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 用法总结
     */
    private String usageSummary;
    
    /**
     * 常用短语/搭配列表
     */
    private List<String> commonPhrases;
    
    /**
     * 验证命令
     * @throws IllegalArgumentException 如果参数无效
     */
    public void validate() {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("词性ID不能为空");
        }
        
        if (englishName == null || englishName.trim().isEmpty()) {
            throw new IllegalArgumentException("词性英文名称不能为空");
        }
        
        if (chineseMeaning == null || chineseMeaning.trim().isEmpty()) {
            throw new IllegalArgumentException("词性中文意思不能为空");
        }
    }
}