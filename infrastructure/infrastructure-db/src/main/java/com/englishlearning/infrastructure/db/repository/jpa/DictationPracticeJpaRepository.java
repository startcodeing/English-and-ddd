package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.DictationPracticePO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 听写练习JPA仓储接口
 */
@Repository
public interface DictationPracticeJpaRepository extends JpaRepository<DictationPracticePO, Long> {
    
    /**
     * 根据听力资料ID查找听写练习列表
     */
    List<DictationPracticePO> findByListenMaterialId(Long listenMaterialId);
    
    /**
     * 根据状态查找听写练习列表
     */
    List<DictationPracticePO> findByStatus(String status);
    
    /**
     * 根据听力资料ID和状态查找听写练习列表
     */
    List<DictationPracticePO> findByListenMaterialIdAndStatus(Long listenMaterialId, String status);
    
    /**
     * 分页查询听写练习（支持条件查询）
     */
    @Query("SELECT d FROM DictationPracticePO d WHERE " +
           "(:listenMaterialId IS NULL OR d.listenMaterialId = :listenMaterialId) AND " +
           "(:status IS NULL OR d.status = :status) " +
           "ORDER BY d.createTime DESC")
    Page<DictationPracticePO> findByConditions(@Param("listenMaterialId") Long listenMaterialId,
                                               @Param("status") String status,
                                               Pageable pageable);
    
    /**
     * 统计听写练习数量（支持条件查询）
     */
    @Query("SELECT COUNT(d) FROM DictationPracticePO d WHERE " +
           "(:listenMaterialId IS NULL OR d.listenMaterialId = :listenMaterialId) AND " +
           "(:status IS NULL OR d.status = :status)")
    long countByConditions(@Param("listenMaterialId") Long listenMaterialId,
                          @Param("status") String status);
    
    /**
     * 批量删除听写练习
     */
    void deleteByIdIn(List<Long> ids);
}