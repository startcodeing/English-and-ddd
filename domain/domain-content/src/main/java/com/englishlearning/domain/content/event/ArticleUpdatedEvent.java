package com.englishlearning.domain.content.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleUpdatedEvent {
    private String articleId;
    private String title;
    private String content;
    private Integer difficultyLevel;
}