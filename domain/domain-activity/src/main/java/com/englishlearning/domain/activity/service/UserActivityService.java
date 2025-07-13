package com.englishlearning.domain.activity.service;

import com.englishlearning.domain.activity.model.entity.UserActivity;
import com.englishlearning.domain.activity.model.enums.ActivityType;

/**
 * 用户活动服务接口
 */
public interface UserActivityService {
    
    /**
     * 记录用户活动
     * 
     * @param userId 用户ID
     * @param username 用户名
     * @param activityType 活动类型
     * @param title 活动标题
     * @param resourceId 资源ID
     * @param resourceType 资源类型
     * @return 用户活动记录
     */
    UserActivity recordActivity(String userId, String username, ActivityType activityType, 
                               String title, String resourceId, String resourceType);
    
    /**
     * 记录用户活动（带自定义描述）
     * 
     * @param userId 用户ID
     * @param username 用户名
     * @param activityType 活动类型
     * @param title 活动标题
     * @param description 活动描述
     * @param resourceId 资源ID
     * @param resourceType 资源类型
     * @return 用户活动记录
     */
    UserActivity recordActivity(String userId, String username, ActivityType activityType, 
                               String title, String description, String resourceId, String resourceType);
    
    /**
     * 获取用户最近活动
     * 
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    java.util.List<UserActivity> getUserRecentActivities(String userId, int page, int size);
    
    /**
     * 获取用户特定类型的活动
     * 
     * @param userId 用户ID
     * @param activityType 活动类型
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    java.util.List<UserActivity> getUserActivitiesByType(String userId, ActivityType activityType, int page, int size);
    
    /**
     * 获取用户在特定时间范围内的活动
     * 
     * @param userId 用户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    java.util.List<UserActivity> getUserActivitiesByTimeRange(String userId, java.time.LocalDateTime startTime, 
                                                           java.time.LocalDateTime endTime, int page, int size);
    
    /**
     * 统计用户特定类型活动的数量
     * 
     * @param userId 用户ID
     * @param activityType 活动类型
     * @return 活动数量
     */
    long countUserActivitiesByType(String userId, ActivityType activityType);
}