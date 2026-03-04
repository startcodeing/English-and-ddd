package com.englishlearning.domain.user.event;

import lombok.Getter;

/**
 * 用户登录事件
 */
@Getter
public class UserLoggedInEvent {
    private final Long userId;
    private final String username;
    private final String ipAddress;
    private final long occurredAt;

    public UserLoggedInEvent(Long userId, String username, String ipAddress) {
        this.userId = userId;
        this.username = username;
        this.ipAddress = ipAddress;
        this.occurredAt = System.currentTimeMillis();
    }
}
