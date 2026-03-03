package com.englishlearning.domain.user.event;

import lombok.Getter;

/**
 * 用户创建事件
 */
@Getter
public class UserCreatedEvent {
    private final Long userId;
    private final String username;
    private final String email;
    private final long occurredAt;

    public UserCreatedEvent(Long userId, String username, String email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.occurredAt = System.currentTimeMillis();
    }
}
