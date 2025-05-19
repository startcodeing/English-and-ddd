package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.WordPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 单词JPA仓储接口
 */
@Repository
public interface WordJpaRepository extends JpaRepository<WordPO, String> {
    
    /**
     * 根据拼写查找单词
     */
    Optional<WordPO> findBySpelling(String spelling);
    
    /**
     * 根据多个拼写查找单词列表
     */
    List<WordPO> findBySpellingIn(List<String> spellings);
} 