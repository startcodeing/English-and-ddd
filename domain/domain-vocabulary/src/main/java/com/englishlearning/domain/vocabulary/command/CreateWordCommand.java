package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 创建单词命令
 * 封装创建单词所需的参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateWordCommand {

    /**
     * 难度级别（1-5级）
     */
    private Integer difficultyLevel;

    /**
     * 拼写
     */
    private String spelling;
    
    /**
     * 词性ID
     */
    private String partOfSpeechId;
    
    /**
     * 发音
     */
    private String pronunciation;
    
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
        if (spelling == null || spelling.trim().isEmpty()) {
            throw new IllegalArgumentException("单词拼写不能为空");
        }
        
        if (partOfSpeechId == null || partOfSpeechId.trim().isEmpty()) {
            throw new IllegalArgumentException("词性ID不能为空");
        }
        
        if (chineseMeaning == null || chineseMeaning.trim().isEmpty()) {
            throw new IllegalArgumentException("单词中文意思不能为空");
        }
    }
}