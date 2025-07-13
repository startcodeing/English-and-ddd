package com.englishlearning.infrastructure.activity.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 用户活动持久化对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_activity")
public class UserActivityPO {
    
    /**
     * 活动ID
     */
    @Id
    private String id;
    
    /**
     * 用户ID
     */
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    /**
     * 用户名
     */
    @Column(name = "username", nullable = false)
    private String username;
    
    /**
     * 活动类型
     */
    @Column(name = "activity_type", nullable = false)
    private String activityType;
    
    /**
     * 活动标题
     */
    @Column(name = "title", nullable = false)
    private String title;
    
    /**
     * 活动描述
     */
    @Column(name = "description", nullable = false, length = 500)
    private String description;
    
    /**
     * 相关资源ID
     */
    @Column(name = "resource_id")
    private String resourceId;
    
    /**
     * 相关资源类型
     */
    @Column(name = "resource_type")
    private String resourceType;
    
    /**
     * 活动时间
     */
    @Column(name = "activity_time", nullable = false)
    private LocalDateTime activityTime;
}