package com.englishlearning.domain.activity.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户活动事件
 * 记录用户在系统中的各种活动
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActivityEvent {
    
    /**
     * 活动ID
     */
    private String activityId;
    
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
     * 活动标题
     */
    private String activityTitle;
    
    /**
     * 活动描述
     */
    private String activityDescription;
    
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
}