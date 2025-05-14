package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * 词性DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartOfSpeechDTO {
    
    private String id;
    
    @NotBlank(message = "英文名称不能为空")
    private String englishName;
    
    @NotBlank(message = "中文意思不能为空")
    private String chineseMeaning;
    
    private String usageSummary;
    
    private List<String> commonPhrases;
} 