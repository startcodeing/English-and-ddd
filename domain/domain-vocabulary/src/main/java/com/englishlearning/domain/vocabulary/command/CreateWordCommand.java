package com.englishlearning.domain.vocabulary.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
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
     * 发音
     */
    private String pronunciation;
    
    /**
     * 词义列表（不同词性下的含义、同义词、反义词和例句）
     */
    private List<WordMeaningCommand> wordMeanings;


    
    /**
     * 验证命令
     * @throws IllegalArgumentException 如果参数无效
     */
    public void validate() {
        if (spelling == null || spelling.trim().isEmpty()) {
            throw new IllegalArgumentException("单词拼写不能为空");
        }

        // 验证每个词义
        for (WordMeaningCommand meaning : wordMeanings) {
            meaning.validate();
        }
    }
}