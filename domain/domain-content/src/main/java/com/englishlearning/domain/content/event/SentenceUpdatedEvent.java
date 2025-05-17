package com.englishlearning.domain.content.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentenceUpdatedEvent {
    private String sentenceId;
    private String englishContent;
    private String chineseContent;
    private String articleId;
}