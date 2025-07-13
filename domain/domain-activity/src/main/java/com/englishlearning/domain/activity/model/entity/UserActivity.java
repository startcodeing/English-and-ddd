package com.englishlearning.domain.activity.model.entity;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户活动实体
 * 记录用户在系统中的各种活动
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivity {
    
    /**
     * 活动ID
     */
    private String id;
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 活动类型
     */
    private ActivityType activityType;
    
    /**
     * 活动标题
     */
    private String title;
    
    /**
     * 活动描述
     */
    private String description;
    
    /**
     * 相关资源ID
     */
    private String resourceId;
    
    /**
     * 相关资源类型
     */
    private String resourceType;
    
    /**
     * 活动时间
     */
    private LocalDateTime activityTime;
    
    /**
     * 创建用户活动记录
     * 
     * @param userId 用户ID
     * @param username 用户名
     * @param activityType 活动类型
     * @param title 活动标题
     * @param resourceId 资源ID
     * @param resourceType 资源类型
     * @return 用户活动记录
     */
    public static UserActivity create(String userId, String username, ActivityType activityType, 
                                      String title, String resourceId, String resourceType) {
        return UserActivity.builder()
                .id(java.util.UUID.randomUUID().toString())
                .userId(userId)
                .username(username)
                .activityType(activityType)
                .title(title)
                .description(activityType.getDescription())
                .resourceId(resourceId)
                .resourceType(resourceType)
                .activityTime(LocalDateTime.now())
                .build();
    }
    
    /**
     * 创建用户活动记录（带自定义描述）
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
    public static UserActivity create(String userId, String username, ActivityType activityType, 
                                      String title, String description, String resourceId, String resourceType) {
        return UserActivity.builder()
                .id(java.util.UUID.randomUUID().toString())
                .userId(userId)
                .username(username)
                .activityType(activityType)
                .title(title)
                .description(description)
                .resourceId(resourceId)
                .resourceType(resourceType)
                .activityTime(LocalDateTime.now())
                .build();
    }
}