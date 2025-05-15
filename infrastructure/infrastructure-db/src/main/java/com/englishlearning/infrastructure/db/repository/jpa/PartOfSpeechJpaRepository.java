package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.PartOfSpeechPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 词性JPA仓储接口
 */
@Repository
public interface PartOfSpeechJpaRepository extends JpaRepository<PartOfSpeechPO, Long> {
    
    /**
     * 根据英文名称查找词性
     */
    Optional<PartOfSpeechPO> findByEnglishName(String englishName);
}