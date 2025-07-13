package com.englishlearning.domain.activity.dto;

import com.englishlearning.domain.activity.model.entity.UserActivity;
import com.englishlearning.domain.activity.model.enums.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户活动数据传输对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityDTO {
    
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
    private String activityType;
    
    /**
     * 活动类型描述
     */
    private String activityTypeDescription;
    
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
     * 活动时间（格式化）
     */
    private String formattedActivityTime;
    
    /**
     * 模块
     */
    private String module;
    
    /**
     * 将实体转换为DTO
     * 
     * @param userActivity 用户活动实体
     * @return 用户活动DTO
     */
    public static UserActivityDTO fromEntity(UserActivity userActivity) {
        ActivityType type = userActivity.getActivityType();
        return UserActivityDTO.builder()
                .id(userActivity.getId())
                .userId(userActivity.getUserId())
                .username(userActivity.getUsername())
                .activityType(type.name())
                .activityTypeDescription(type.getDescription())
                .title(userActivity.getTitle())
                .description(userActivity.getDescription())
                .resourceId(userActivity.getResourceId())
                .resourceType(userActivity.getResourceType())
                .activityTime(userActivity.getActivityTime())
                .formattedActivityTime(formatActivityTime(userActivity.getActivityTime()))
                .module(type.getModule())
                .build();
    }
    
    /**
     * 格式化活动时间
     * 
     * @param activityTime 活动时间
     * @return 格式化后的活动时间
     */
    private static String formatActivityTime(LocalDateTime activityTime) {
        LocalDateTime now = LocalDateTime.now();
        java.time.Duration duration = java.time.Duration.between(activityTime, now);
        
        if (duration.toMinutes() < 1) {
            return "刚刚";
        } else if (duration.toHours() < 1) {
            return duration.toMinutes() + "分钟前";
        } else if (duration.toDays() < 1) {
            return duration.toHours() + "小时前";
        } else if (duration.toDays() < 30) {
            return duration.toDays() + "天前";
        } else {
            return activityTime.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        }
    }
}