package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 删除词性例句DTO
 */

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeleteWordMeaningSentenceDTO {

    private String wordId;
    private String wordMeaningId;
    private List<String> sentenceIdList;
}
