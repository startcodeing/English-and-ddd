package com.englishlearning.application.content.dto;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * 句子数据传输对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentenceDTO {
    
    private String id;
    
    @NotBlank(message = "英文内容不能为空")
    @Size(max = 500, message = "英文内容长度不能超过500个字符")
    private String englishContent;
    
    @NotBlank(message = "中文意思不能为空")
    @Size(max = 500, message = "中文意思长度不能超过500个字符")
    private String chineseMeaning;
    
    private String grammarAnalysis;
    
    private List<SentenceVariantDTO> variants;
    
    private List<WordDTO> unfamiliarWords;
} 