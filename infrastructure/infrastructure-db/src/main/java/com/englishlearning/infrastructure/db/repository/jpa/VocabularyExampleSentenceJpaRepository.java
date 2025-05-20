package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.VocabularyExampleSentencePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 词汇例句JPA仓储接口
 */
@Repository
public interface VocabularyExampleSentenceJpaRepository extends JpaRepository<VocabularyExampleSentencePO, String> {
    
    /**
     * 根据例句内容模糊查询
     */
    List<VocabularyExampleSentencePO> findBySentenceContaining(String sentence);
    
    /**
     * 根据翻译内容模糊查询
     */
    List<VocabularyExampleSentencePO> findByTranslationContaining(String translation);
}