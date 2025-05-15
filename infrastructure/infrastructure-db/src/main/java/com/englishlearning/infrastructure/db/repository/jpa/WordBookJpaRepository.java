package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.WordBookPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 单词本JPA仓储接口
 */
@Repository
public interface WordBookJpaRepository extends JpaRepository<WordBookPO, Long> {
    
    /**
     * 根据名称查找单词本
     */
    Optional<WordBookPO> findByName(String name);
}