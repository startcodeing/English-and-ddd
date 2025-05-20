package com.englishlearning.domain.vocabulary.repository;

import com.englishlearning.domain.vocabulary.model.entity.VocabularyExampleSentence;

import java.util.List;
import java.util.Optional;

/**
 * 词汇例句仓储接口
 */
public interface VocabularyExampleSentenceRepository {
    
    /**
     * 保存例句
     */
    VocabularyExampleSentence save(VocabularyExampleSentence sentence);
    
    /**
     * 根据ID查找例句
     */
    Optional<VocabularyExampleSentence> findById(String id);
    
    /**
     * 根据例句内容模糊查询
     */
    List<VocabularyExampleSentence> findBySentenceContaining(String sentence);
    
    /**
     * 根据翻译内容模糊查询
     */
    List<VocabularyExampleSentence> findByTranslationContaining(String translation);
    
    /**
     * 查询所有例句
     */
    List<VocabularyExampleSentence> findAll();
    
    /**
     * 根据ID删除例句
     */
    void deleteById(String id);
}