package com.englishlearning.application.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 句子变体数据传输对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentenceVariantDTO {
    
    private String id;
    
    @NotBlank(message = "变体内容不能为空")
    @Size(max = 500, message = "变体内容长度不能超过500个字符")
    private String content;
    
    @NotBlank(message = "变体类型不能为空")
    private String type;
    
    private String description;
} 