package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.infrastructure.db.po.ListeningMaterialPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 听力资料JPA仓储接口
 */
@Repository
public interface ListeningMaterialJpaRepository extends JpaRepository<ListeningMaterialPO, Long> {
    
    /**
     * 根据难度级别查询听力资料列表
     *
     * @param difficulty 难度级别
     * @return 听力资料列表
     */
    List<ListeningMaterialPO> findByDifficulty(DifficultyLevel difficulty);
    
    /**
     * 根据标题模糊查询听力资料列表
     *
     * @param title 标题关键字
     * @return 听力资料列表
     */
    List<ListeningMaterialPO> findByTitleContaining(String title);
    
    // JpaRepository已经提供了findAll(Pageable)方法，返回类型是Page<T>
}