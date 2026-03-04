package com.englishlearning.domain.user.model.valueobject;

import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * 用户ID值对象
 * 使用Long类型，与UserContext兼容
 */
@Getter
@EqualsAndHashCode
public class UserId {
    private final Long value;

    public UserId(Long value) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        this.value = value;
    }

    public static UserId of(Long value) {
        return new UserId(value);
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
