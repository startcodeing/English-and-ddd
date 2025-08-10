package com.englishlearning.domain.content.model;

import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarAnalysis {
    private Long id;
    private String title;
    private String originContent;
    private DifficultyLevel difficulty;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}