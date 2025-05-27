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
public class AddWordMeaningSynonymDTO {

    @NotEmpty(message = "'wordId'不能为空")
    String wordId;
    @NotEmpty(message = "'wordMeaningId'不能为空")
    String wordMeaningId;
    @NotEmpty(message = "'synonymWordId'不能为空")
    String synonymWordId;
    @NotEmpty(message = "'synonymWordMeaningId'不能为空")
    String synonymWordMeaningId;
}
