package com.englishlearning.domain.user.event;

import lombok.Getter;

/**
 * 用户密码修改事件
 */
@Getter
public class UserPasswordChangedEvent {
    private final Long userId;
    private final String username;
    private final long occurredAt;

    public UserPasswordChangedEvent(Long userId, String username) {
        this.userId = userId;
        this.username = username;
        this.occurredAt = System.currentTimeMillis();
    }
}
