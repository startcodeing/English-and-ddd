package com.englishlearning.domain.activity.repository;

import com.englishlearning.domain.activity.model.entity.UserActivity;
import com.englishlearning.domain.activity.model.enums.ActivityType;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户活动仓储接口
 */
public interface UserActivityRepository {
    
    /**
     * 保存用户活动
     * 
     * @param userActivity 用户活动
     * @return 保存后的用户活动
     */
    UserActivity save(UserActivity userActivity);
    
    /**
     * 根据用户ID查询用户活动
     * 
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    List<UserActivity> findByUserId(String userId, int page, int size);
    
    /**
     * 根据用户ID和活动类型查询用户活动
     * 
     * @param userId 用户ID
     * @param activityType 活动类型
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    List<UserActivity> findByUserIdAndActivityType(String userId, ActivityType activityType, int page, int size);
    
    /**
     * 根据用户ID和时间范围查询用户活动
     * 
     * @param userId 用户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    List<UserActivity> findByUserIdAndTimeRange(String userId, LocalDateTime startTime, LocalDateTime endTime, int page, int size);
    
    /**
     * 根据资源ID和资源类型查询用户活动
     * 
     * @param resourceId 资源ID
     * @param resourceType 资源类型
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    List<UserActivity> findByResourceIdAndResourceType(String resourceId, String resourceType, int page, int size);
    
    /**
     * 统计用户某类活动的数量
     * 
     * @param userId 用户ID
     * @param activityType 活动类型
     * @return 活动数量
     */
    long countByUserIdAndActivityType(String userId, ActivityType activityType);
}