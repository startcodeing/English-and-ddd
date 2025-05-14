package com.englishlearning.domain.content.service;

import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.model.entity.SentenceVariant;
import com.englishlearning.domain.vocabulary.model.entity.Word;

import java.util.List;
import java.util.Optional;

/**
 * 句子领域服务接口
 */
public interface SentenceService {
    
    /**
     * 创建句子
     */
    Sentence createSentence(Sentence sentence);
    
    /**
     * 更新句子
     */
    Sentence updateSentence(Sentence sentence);
    
    /**
     * 查找句子
     */
    Optional<Sentence> findSentenceById(String id);
    
    /**
     * 查找所有句子
     */
    List<Sentence> findAllSentences();
    
    /**
     * 根据英文内容查找句子
     */
    List<Sentence> findSentencesByEnglishContent(String englishContent);
    
    /**
     * 根据中文意思查找句子
     */
    List<Sentence> findSentencesByChineseMeaning(String chineseMeaning);
    
    /**
     * 为句子添加变体
     */
    Sentence addVariant(String sentenceId, SentenceVariant variant);
    
    /**
     * 为句子添加陌生单词
     */
    Sentence addUnfamiliarWord(String sentenceId, Word word);
    
    /**
     * 移除句子的陌生单词
     */
    Sentence removeUnfamiliarWord(String sentenceId, String wordId);
    
    /**
     * 分析句子结构
     */
    String analyzeSentenceGrammar(String sentenceId);
    
    /**
     * 删除句子
     */
    void deleteSentence(String id);
} 