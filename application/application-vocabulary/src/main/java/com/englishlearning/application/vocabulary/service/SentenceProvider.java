package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.ExampleSentenceDTO;

import java.util.List;


/**
 * 避免循环依赖，这里定义vocabulary模块需要的content模块的能力，由content模块实现
 */
public interface SentenceProvider {

    List<String> addSentence(List<ExampleSentenceDTO.SentenceDTO> sentenceList);
}
