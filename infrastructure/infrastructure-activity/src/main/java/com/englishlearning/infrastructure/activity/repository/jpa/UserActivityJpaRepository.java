package com.englishlearning.infrastructure.activity.repository.jpa;

import com.englishlearning.infrastructure.activity.po.UserActivityPO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户活动JPA仓储接口
 */
@Repository
public interface UserActivityJpaRepository extends JpaRepository<UserActivityPO, String> {
    
    /**
     * 根据用户ID查询用户活动
     * 
     * @param userId 用户ID
     * @param pageable 分页参数
     * @return 用户活动列表
     */
    List<UserActivityPO> findByUserId(String userId, Pageable pageable);
    
    /**
     * 根据用户ID和活动类型查询用户活动
     * 
     * @param userId 用户ID
     * @param activityType 活动类型
     * @param pageable 分页参数
     * @return 用户活动列表
     */
    List<UserActivityPO> findByUserIdAndActivityType(String userId, String activityType, Pageable pageable);
    
    /**
     * 根据用户ID和时间范围查询用户活动
     * 
     * @param userId 用户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param pageable 分页参数
     * @return 用户活动列表
     */
    List<UserActivityPO> findByUserIdAndActivityTimeBetween(String userId, LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);
    
    /**
     * 根据资源ID和资源类型查询用户活动
     * 
     * @param resourceId 资源ID
     * @param resourceType 资源类型
     * @param pageable 分页参数
     * @return 用户活动列表
     */
    List<UserActivityPO> findByResourceIdAndResourceType(String resourceId, String resourceType, Pageable pageable);
    
    /**
     * 统计用户某类活动的数量
     * 
     * @param userId 用户ID
     * @param activityType 活动类型
     * @return 活动数量
     */
    long countByUserIdAndActivityType(String userId, String activityType);
}