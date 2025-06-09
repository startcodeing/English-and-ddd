package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SynonymDetailDTO {

    private String synonymSpell;
    private String synonymWordId;
    private String synonymMeaningId;
}
