package com.englishlearning.domain.content.repository;

import com.englishlearning.domain.content.model.entity.Sentence;

import java.util.List;
import java.util.Optional;

/**
 * 句子仓储接口
 */
public interface SentenceRepository {
    
    /**
     * 保存句子
     */
    Sentence save(Sentence sentence);
    
    /**
     * 根据ID查找句子
     */
    Optional<Sentence> findById(String id);
    
    /**
     * 根据英文内容模糊查询句子
     */
    List<Sentence> findByEnglishContentLike(String englishContent);
    
    /**
     * 根据中文意思模糊查询句子
     */
    List<Sentence> findByChineseMeaningLike(String chineseMeaning);
    
    /**
     * 查询所有句子
     */
    List<Sentence> findAll();
    
    /**
     * 查询包含特定单词的句子
     */
    List<Sentence> findByUnfamiliarWordId(String wordId);
    
    /**
     * 删除句子
     */
    void deleteById(String id);
} 