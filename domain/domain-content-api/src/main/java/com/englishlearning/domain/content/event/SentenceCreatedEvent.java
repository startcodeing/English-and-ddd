package com.englishlearning.domain.content.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentenceCreatedEvent {
    private String sentenceId;
    private String englishContent;
    private String chineseContent;
    private String articleId;
} 