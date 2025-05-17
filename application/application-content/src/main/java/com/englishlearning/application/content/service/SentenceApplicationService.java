package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.vocabulary.dto.WordDTO;

import java.util.List;
import java.util.Optional;

/**
 * 句子应用服务接口
 */
public interface SentenceApplicationService {
    
    /**
     * 创建句子
     */
    SentenceDTO createSentence(SentenceDTO sentenceDTO);
    
    /**
     * 更新句子
     */
    SentenceDTO updateSentence(SentenceDTO sentenceDTO);
    
    /**
     * 查找句子
     */
    Optional<SentenceDTO> findSentenceById(String id);
    
    /**
     * 查找所有句子
     */
    List<SentenceDTO> findAllSentences();
    
    /**
     * 根据英文内容查找句子
     */
    List<SentenceDTO> findSentencesByEnglishContent(String englishContent);
    
    /**
     * 根据中文意思查找句子
     */
    List<SentenceDTO> findSentencesByChineseMeaning(String chineseMeaning);
    
    /**
     * 为句子添加变体
     */
    SentenceDTO addVariant(String sentenceId, SentenceVariantDTO variantDTO);
    
    /**
     * 为句子添加陌生单词
     */
    SentenceDTO addUnfamiliarWord(String sentenceId, WordDTO wordDTO);
    
    /**
     * 删除句子
     */
    void deleteSentence(String id);
}