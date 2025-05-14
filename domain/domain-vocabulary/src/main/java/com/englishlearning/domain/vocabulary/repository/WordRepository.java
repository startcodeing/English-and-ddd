package com.englishlearning.domain.vocabulary.repository;

import com.englishlearning.domain.vocabulary.model.entity.Word;

import java.util.List;
import java.util.Optional;

/**
 * 单词仓储接口
 */
public interface WordRepository {
    
    /**
     * 保存单词
     */
    Word save(Word word);
    
    /**
     * 根据ID查找单词
     */
    Optional<Word> findById(String id);
    
    /**
     * 根据拼写查找单词
     */
    Optional<Word> findBySpelling(String spelling);
    
    /**
     * 根据中文意思模糊查询单词
     */
    List<Word> findByChineseMeaningLike(String chineseMeaning);
    
    /**
     * 根据词性ID查询单词列表
     */
    List<Word> findByPartOfSpeechId(String partOfSpeechId);
    
    /**
     * 查询所有单词
     */
    List<Word> findAll();
    
    /**
     * 删除单词
     */
    void deleteById(String id);
} 