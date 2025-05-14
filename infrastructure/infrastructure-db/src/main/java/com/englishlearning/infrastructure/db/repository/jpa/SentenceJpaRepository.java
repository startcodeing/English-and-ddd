package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.SentencePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 句子JPA仓储接口
 */
@Repository
public interface SentenceJpaRepository extends JpaRepository<SentencePO, String> {
    
    /**
     * 根据英文内容模糊查询
     */
    List<SentencePO> findByEnglishContentContaining(String englishContent);
    
    /**
     * 根据中文意思模糊查询
     */
    List<SentencePO> findByChineseMeaningContaining(String chineseMeaning);
    
    /**
     * 查找包含特定单词的句子
     */
    @Query("SELECT s FROM SentencePO s JOIN s.unfamiliarWords w WHERE w.id = :wordId")
    List<SentencePO> findByUnfamiliarWordId(@Param("wordId") String wordId);
} 