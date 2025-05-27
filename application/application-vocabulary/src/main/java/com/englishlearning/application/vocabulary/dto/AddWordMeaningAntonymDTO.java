package com.englishlearning.application.vocabulary.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddWordMeaningAntonymDTO {

    @NotEmpty(message = "'wordId'不能为空")
    String wordId;
    @NotEmpty(message = "'wordMeaningId'不能为空")
    String wordMeaningId;
    @NotEmpty(message = "'antonymWordId'不能为空")
    String antonymWordId;
    @NotEmpty(message = "'antonymMeaningId'不能为空")
    String antonymMeaningId;
}
