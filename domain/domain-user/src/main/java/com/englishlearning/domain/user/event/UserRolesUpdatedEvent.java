package com.englishlearning.domain.user.event;

import com.englishlearning.domain.user.model.enums.UserRole;
import lombok.Getter;

import java.util.Set;

/**
 * 用户角色更新事件
 */
@Getter
public class UserRolesUpdatedEvent {
    private final Long userId;
    private final String username;
    private final Set<UserRole> oldRoles;
    private final Set<UserRole> newRoles;
    private final long occurredAt;

    public UserRolesUpdatedEvent(Long userId, String username, Set<UserRole> oldRoles, Set<UserRole> newRoles) {
        this.userId = userId;
        this.username = username;
        this.oldRoles = oldRoles;
        this.newRoles = newRoles;
        this.occurredAt = System.currentTimeMillis();
    }
}
