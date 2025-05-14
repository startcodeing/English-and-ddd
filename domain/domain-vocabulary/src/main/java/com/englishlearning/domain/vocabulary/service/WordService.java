package com.englishlearning.domain.vocabulary.service;

import com.englishlearning.domain.vocabulary.model.entity.Word;

import java.util.List;
import java.util.Optional;

/**
 * 单词领域服务接口
 */
public interface WordService {
    
    /**
     * 创建单词
     */
    Word createWord(Word word);
    
    /**
     * 更新单词
     */
    Word updateWord(Word word);
    
    /**
     * 查找单词
     */
    Optional<Word> findWordById(String id);
    
    /**
     * 根据拼写查找单词
     */
    Optional<Word> findWordBySpelling(String spelling);
    
    /**
     * 查找所有单词
     */
    List<Word> findAllWords();
    
    /**
     * 根据词性查找单词
     */
    List<Word> findWordsByPartOfSpeech(String partOfSpeechId);
    
    /**
     * 设置单词同义词
     */
    void addSynonym(String wordId, String synonymId);
    
    /**
     * 设置单词反义词
     */
    void addAntonym(String wordId, String antonymId);
    
    /**
     * 删除单词
     */
    void deleteWord(String id);
} 