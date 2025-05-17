package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 添加单词词义命令
 * 用于向单词添加新的词义（不同词性下的含义）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddWordMeaningCommand {
    
    /**
     * 单词ID
     */
    private String wordId;
    
    /**
     * 词性ID
     */
    private String partOfSpeechId;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 例句列表
     */
    private List<String> exampleSentences;

    /**
     * 同义词列表
     */
    private List<String> synonymIds;

    /**
     * 反义词列表
     */
    private List<String> antonymIds;
    
    /**
     * 验证命令
     * @throws IllegalArgumentException 如果参数无效
     */
    public void validate() {
        if (wordId == null || wordId.trim().isEmpty()) {
            throw new IllegalArgumentException("单词ID不能为空");
        }
        
        if (partOfSpeechId == null || partOfSpeechId.trim().isEmpty()) {
            throw new IllegalArgumentException("词性ID不能为空");
        }
        
        if (chineseMeaning == null || chineseMeaning.trim().isEmpty()) {
            throw new IllegalArgumentException("单词中文意思不能为空");
        }
    }
}