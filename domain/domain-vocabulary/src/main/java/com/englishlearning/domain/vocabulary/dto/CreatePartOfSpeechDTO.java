package com.englishlearning.domain.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 创建词性命令
 * 封装创建词性所需的参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePartOfSpeechDTO {
    
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

}