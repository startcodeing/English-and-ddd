package com.englishlearning.domain.activity.service.impl;

import com.englishlearning.domain.activity.model.entity.UserActivity;
import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.repository.UserActivityRepository;
import com.englishlearning.domain.activity.service.UserActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户活动服务实现类
 */
@Service
public class UserActivityServiceImpl implements UserActivityService {
    
    private final UserActivityRepository userActivityRepository;
    
    @Autowired
    public UserActivityServiceImpl(UserActivityRepository userActivityRepository) {
        this.userActivityRepository = userActivityRepository;
    }
    
    @Override
    public UserActivity recordActivity(String userId, String username, ActivityType activityType, 
                                      String title, String resourceId, String resourceType) {
        UserActivity userActivity = UserActivity.create(userId, username, activityType, title, resourceId, resourceType);
        return userActivityRepository.save(userActivity);
    }
    
    @Override
    public UserActivity recordActivity(String userId, String username, ActivityType activityType, 
                                      String title, String description, String resourceId, String resourceType) {
        UserActivity userActivity = UserActivity.create(userId, username, activityType, title, description, resourceId, resourceType);
        return userActivityRepository.save(userActivity);
    }
    
    @Override
    public List<UserActivity> getUserRecentActivities(String userId, int page, int size) {
        return userActivityRepository.findByUserId(userId, page, size);
    }
    
    @Override
    public List<UserActivity> getUserActivitiesByType(String userId, ActivityType activityType, int page, int size) {
        return userActivityRepository.findByUserIdAndActivityType(userId, activityType, page, size);
    }
    
    @Override
    public List<UserActivity> getUserActivitiesByTimeRange(String userId, LocalDateTime startTime, 
                                                        LocalDateTime endTime, int page, int size) {
        return userActivityRepository.findByUserIdAndTimeRange(userId, startTime, endTime, page, size);
    }
    
    @Override
    public long countUserActivitiesByType(String userId, ActivityType activityType) {
        return userActivityRepository.countByUserIdAndActivityType(userId, activityType);
    }
}