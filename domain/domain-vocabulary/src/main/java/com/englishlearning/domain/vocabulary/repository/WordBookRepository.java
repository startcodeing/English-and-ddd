package com.englishlearning.domain.vocabulary.repository;

import com.englishlearning.domain.vocabulary.model.entity.WordBook;

import java.util.List;
import java.util.Optional;

/**
 * 单词本仓储接口
 */
public interface WordBookRepository {
    
    /**
     * 保存单词本
     */
    WordBook save(WordBook wordBook);
    
    /**
     * 根据ID查找单词本
     */
    Optional<WordBook> findById(String id);
    
    /**
     * 根据名称查找单词本
     */
    Optional<WordBook> findByName(String name);
    
    /**
     * 查询所有单词本
     */
    List<WordBook> findAll();
    
    /**
     * 删除单词本
     */
    void deleteById(String id);
}