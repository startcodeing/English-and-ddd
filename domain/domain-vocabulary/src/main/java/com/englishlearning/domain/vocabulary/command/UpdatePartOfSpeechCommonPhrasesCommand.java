package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 更新词性常用短语命令
 * 封装更新词性常用短语所需的参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePartOfSpeechCommonPhrasesCommand {
    
    /**
     * 词性ID
     */
    private String id;
    
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
        
        if (commonPhrases == null) {
            throw new IllegalArgumentException("常用短语列表不能为null");
        }
    }
}