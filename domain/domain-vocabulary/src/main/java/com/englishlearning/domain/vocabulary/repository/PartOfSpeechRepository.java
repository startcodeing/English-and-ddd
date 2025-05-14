package com.englishlearning.domain.vocabulary.repository;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;

import java.util.List;
import java.util.Optional;

/**
 * 词性仓储接口
 */
public interface PartOfSpeechRepository {
    
    /**
     * 保存词性
     */
    PartOfSpeech save(PartOfSpeech partOfSpeech);
    
    /**
     * 根据ID查找词性
     */
    Optional<PartOfSpeech> findById(String id);
    
    /**
     * 根据英文名称查找词性
     */
    Optional<PartOfSpeech> findByEnglishName(String englishName);
    
    /**
     * 查询所有词性
     */
    List<PartOfSpeech> findAll();
    
    /**
     * 删除词性
     */
    void deleteById(String id);
} 