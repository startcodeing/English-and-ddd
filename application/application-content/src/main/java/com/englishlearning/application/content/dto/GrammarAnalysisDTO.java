package com.englishlearning.application.content.dto;

import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GrammarAnalysisDTO {
    private Long id;
    private String title;
    private String originContent;
    private String difficulty;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}