package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.WordBookWordPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

/**
 * 单词本-单词关联表JPA仓储接口
 */
@Repository
public interface WordBookWordJpaRepository extends JpaRepository<WordBookWordPO, WordBookWordPO.WordBookWordId> {
    
    /**
     * 根据单词ID删除单词本-单词关联记录
     */
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM word_book_word WHERE word_id = ?1", nativeQuery = true)
    void deleteByWordId(String wordId);
}