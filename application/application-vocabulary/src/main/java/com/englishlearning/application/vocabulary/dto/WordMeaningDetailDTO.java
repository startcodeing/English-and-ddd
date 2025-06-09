package com.englishlearning.application.vocabulary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WordMeaningDetailDTO {

    /**
     * ID
     */
    private String id;

    /**
     * 单词ID
     */
    private String wordId;

    /**
     * 词性
     */
    private String partOfSpeechId;

    /**
     * 中文意思
     */
    private String chineseMeaning;

    /**
     * 同义词列表
     */
    private List<SynonymDetailDTO> synonyms;

    /**
     * 反义词列表
     */
    private List<AntonymDetailDTO> antonyms;

    /**
     * 例句主键列表
     */
    private List<ExampleSentenceDetailDTO> exampleSentenceIds;
}
