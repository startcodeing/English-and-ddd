package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 单词词义命令
 * 表示单词在特定词性下的含义、同义词、反义词和例句
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordMeaningCommand {
    
    /**
     * 词性ID
     */
    private String partOfSpeechId;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 同义词列表
     */
    private List<String> synonymIds;
    
    /**
     * 反义词列表
     */
    private List<String> antonymIds;
    
    /**
     * 例句列表
     */
    private List<String> exampleSentences;
    
    /**
     * 验证命令
     * @throws IllegalArgumentException 如果参数无效
     */
    public void validate() {
        if (partOfSpeechId == null || partOfSpeechId.trim().isEmpty()) {
            throw new IllegalArgumentException("词性ID不能为空");
        }
        
        if (chineseMeaning == null || chineseMeaning.trim().isEmpty()) {
            throw new IllegalArgumentException("单词中文意思不能为空");
        }
        
        // 确保列表不为null
        if (synonymIds == null) {
            synonymIds = new ArrayList<>();
        }
        
        if (antonymIds == null) {
            antonymIds = new ArrayList<>();
        }
        
        if (exampleSentences == null) {
            exampleSentences = new ArrayList<>();
        }
    }
}