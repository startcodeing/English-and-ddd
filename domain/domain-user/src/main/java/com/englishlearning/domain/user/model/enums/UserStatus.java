package com.englishlearning.domain.user.model.enums;

/**
 * 用户状态枚举
 */
public enum UserStatus {
    /**
     * 活跃状态 - 正常使用
     */
    ACTIVE("活跃"),

    /**
     * 未激活 - 等待邮箱验证
     */
    INACTIVE("未激活"),

    /**
     * 锁定 - 被管理员锁定或多次登录失败
     */
    LOCKED("锁定"),

    /**
     * 已删除 - 软删除状态
     */
    DELETED("已删除");

    private final String description;

    UserStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
