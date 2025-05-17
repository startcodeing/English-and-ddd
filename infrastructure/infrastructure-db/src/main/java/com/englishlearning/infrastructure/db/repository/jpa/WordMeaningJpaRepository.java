package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.WordMeaningPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 单词词义JPA仓储接口
 */
@Repository
public interface WordMeaningJpaRepository extends JpaRepository<WordMeaningPO, String> {
    
    /**
     * 根据单词ID查找所有词义
     */
    List<WordMeaningPO> findByWordId(String wordId);
    
    /**
     * 根据单词ID和词性ID查找词义
     */
    WordMeaningPO findByWordIdAndPartOfSpeechId(String wordId, String partOfSpeechId);
    
    /**
     * 根据词性ID查找所有词义
     */
    List<WordMeaningPO> findByPartOfSpeechId(String partOfSpeechId);
    
    /**
     * 根据单词ID删除所有词义
     */
    void deleteByWordId(String wordId);


    /**
     * 查找中文意思相同的单词集合
     */
    List<WordMeaningPO> findByChineseMeaningContaining(String chineseMeaning);
}