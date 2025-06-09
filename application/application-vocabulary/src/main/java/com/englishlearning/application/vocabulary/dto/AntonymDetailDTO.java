package com.englishlearning.application.vocabulary.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AntonymDetailDTO {

    private String antonymSpell;
    private String antonymWordId;
    private String antonymMeaningId;
}
