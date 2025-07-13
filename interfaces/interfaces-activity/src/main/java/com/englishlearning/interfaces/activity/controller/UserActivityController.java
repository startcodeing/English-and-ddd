package com.englishlearning.interfaces.activity.controller;

import com.englishlearning.domain.activity.dto.UserActivityDTO;
import com.englishlearning.domain.activity.model.entity.UserActivity;
import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户活动控制器
 */
@RestController
@RequestMapping("/api/activities")
public class UserActivityController {
    
    private final UserActivityService userActivityService;
    
    @Autowired
    public UserActivityController(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }
    
    /**
     * 获取用户最近活动
     * 
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    @GetMapping("/recent")
    public ResponseEntity<List<UserActivityDTO>> getUserRecentActivities(
            @RequestParam("userId") String userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        userId = "system";
        List<UserActivity> activities = userActivityService.getUserRecentActivities(userId, page, size);
        List<UserActivityDTO> activityDTOs = activities.stream()
                .map(UserActivityDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(activityDTOs);
    }
    
    /**
     * 获取用户特定类型的活动
     * 
     * @param userId 用户ID
     * @param activityType 活动类型
     * @param page 页码
     * @param size 每页大小
     * @return 用户活动列表
     */
    @GetMapping("/by-type")
    public ResponseEntity<List<UserActivityDTO>> getUserActivitiesByType(
            @RequestParam("userId") String userId,
            @RequestParam("activityType") String activityType,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        ActivityType type = ActivityType.valueOf(activityType);
        List<UserActivity> activities = userActivityService.getUserActivitiesByType(userId, type, page, size);
        List<UserActivityDTO> activityDTOs = activities.stream()
                .map(UserActivityDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(activityDTOs);
    }
    
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
    @GetMapping("/by-time-range")
    public ResponseEntity<List<UserActivityDTO>> getUserActivitiesByTimeRange(
            @RequestParam("userId") String userId,
            @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam("endTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        List<UserActivity> activities = userActivityService.getUserActivitiesByTimeRange(userId, startTime, endTime, page, size);
        List<UserActivityDTO> activityDTOs = activities.stream()
                .map(UserActivityDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(activityDTOs);
    }
    
    /**
     * 统计用户特定类型活动的数量
     * 
     * @param userId 用户ID
     * @param activityType 活动类型
     * @return 活动数量
     */
    @GetMapping("/count-by-type")
    public ResponseEntity<Long> countUserActivitiesByType(
            @RequestParam("userId") String userId,
            @RequestParam("activityType") String activityType) {
        ActivityType type = ActivityType.valueOf(activityType);
        long count = userActivityService.countUserActivitiesByType(userId, type);
        return ResponseEntity.ok(count);
    }
}