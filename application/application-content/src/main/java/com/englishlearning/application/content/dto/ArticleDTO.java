package com.englishlearning.application.content.dto;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章数据传输对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {
    
    private String id;
    
    @NotBlank(message = "标题不能为空")
    @Size(max = 200, message = "标题长度不能超过200个字符")
    private String title;
    
    @NotBlank(message = "内容不能为空")
    private String content;
    
    private String source;
    
    private String author;
    
    private LocalDateTime publishDate;
    
    @Min(value = 1, message = "难度级别最小为1")
    @Max(value = 10, message = "难度级别最大为10")
    private Integer difficultyLevel;
    
    private List<WordDTO> unfamiliarWords;
    
    private List<SentenceDTO> sentences;
} 