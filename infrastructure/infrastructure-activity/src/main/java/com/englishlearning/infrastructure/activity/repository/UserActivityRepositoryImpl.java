package com.englishlearning.infrastructure.activity.repository;

import com.englishlearning.domain.activity.model.entity.UserActivity;
import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.repository.UserActivityRepository;
import com.englishlearning.infrastructure.activity.po.UserActivityPO;
import com.englishlearning.infrastructure.activity.repository.jpa.UserActivityJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户活动仓储实现类
 */
@Repository
public class UserActivityRepositoryImpl implements UserActivityRepository {
    
    private final UserActivityJpaRepository userActivityJpaRepository;
    
    @Autowired
    public UserActivityRepositoryImpl(UserActivityJpaRepository userActivityJpaRepository) {
        this.userActivityJpaRepository = userActivityJpaRepository;
    }
    
    @Override
    public UserActivity save(UserActivity userActivity) {
        UserActivityPO userActivityPO = toUserActivityPO(userActivity);
        UserActivityPO savedUserActivityPO = userActivityJpaRepository.save(userActivityPO);
        return toUserActivity(savedUserActivityPO);
    }
    
    @Override
    public List<UserActivity> findByUserId(String userId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "activityTime"));
        List<UserActivityPO> userActivityPOs = userActivityJpaRepository.findByUserId(userId, pageRequest);
        return userActivityPOs.stream()
                .map(this::toUserActivity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserActivity> findByUserIdAndActivityType(String userId, ActivityType activityType, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "activityTime"));
        List<UserActivityPO> userActivityPOs = userActivityJpaRepository.findByUserIdAndActivityType(
                userId, activityType.name(), pageRequest);
        return userActivityPOs.stream()
                .map(this::toUserActivity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserActivity> findByUserIdAndTimeRange(String userId, LocalDateTime startTime, LocalDateTime endTime, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "activityTime"));
        List<UserActivityPO> userActivityPOs = userActivityJpaRepository.findByUserIdAndActivityTimeBetween(
                userId, startTime, endTime, pageRequest);
        return userActivityPOs.stream()
                .map(this::toUserActivity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserActivity> findByResourceIdAndResourceType(String resourceId, String resourceType, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "activityTime"));
        List<UserActivityPO> userActivityPOs = userActivityJpaRepository.findByResourceIdAndResourceType(
                resourceId, resourceType, pageRequest);
        return userActivityPOs.stream()
                .map(this::toUserActivity)
                .collect(Collectors.toList());
    }
    
    @Override
    public long countByUserIdAndActivityType(String userId, ActivityType activityType) {
        return userActivityJpaRepository.countByUserIdAndActivityType(userId, activityType.name());
    }
    
    /**
     * 将领域实体转换为持久化对象
     * 
     * @param userActivity 用户活动领域实体
     * @return 用户活动持久化对象
     */
    private UserActivityPO toUserActivityPO(UserActivity userActivity) {
        return UserActivityPO.builder()
                .id(userActivity.getId())
                .userId(userActivity.getUserId())
                .username(userActivity.getUsername())
                .activityType(userActivity.getActivityType().name())
                .title(userActivity.getTitle())
                .description(userActivity.getDescription())
                .resourceId(userActivity.getResourceId())
                .resourceType(userActivity.getResourceType())
                .activityTime(userActivity.getActivityTime())
                .build();
    }
    
    /**
     * 将持久化对象转换为领域实体
     * 
     * @param userActivityPO 用户活动持久化对象
     * @return 用户活动领域实体
     */
    private UserActivity toUserActivity(UserActivityPO userActivityPO) {
        return UserActivity.builder()
                .id(userActivityPO.getId())
                .userId(userActivityPO.getUserId())
                .username(userActivityPO.getUsername())
                .activityType(ActivityType.valueOf(userActivityPO.getActivityType()))
                .title(userActivityPO.getTitle())
                .description(userActivityPO.getDescription())
                .resourceId(userActivityPO.getResourceId())
                .resourceType(userActivityPO.getResourceType())
                .activityTime(userActivityPO.getActivityTime())
                .build();
    }
}