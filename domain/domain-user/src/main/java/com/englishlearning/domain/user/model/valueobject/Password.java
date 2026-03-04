package com.englishlearning.domain.user.model.valueobject;

import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * 密码值对象
 * 注意：这个只用于存储原始密码用于验证，实际存储应该是BCrypt加密后的
 */
@Getter
@EqualsAndHashCode
public class Password {
    private final String value;

    public Password(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        if (value.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
        if (value.length() > 100) {
            throw new IllegalArgumentException("Password must not exceed 100 characters");
        }
        this.value = value;
    }

    public static Password of(String value) {
        return new Password(value);
    }

    /**
     * 验证密码是否匹配
     * @param rawPassword 原始密码
     * @param encodedPassword 加密后的密码
     * @return 是否匹配
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return rawPassword != null && encodedPassword != null &&
               rawPassword.equals(new Password(rawPassword).value);
    }
}
