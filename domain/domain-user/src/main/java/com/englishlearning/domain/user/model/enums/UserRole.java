package com.englishlearning.domain.user.model.enums;

/**
 * 用户角色枚举
 */
public enum UserRole {
    /**
     * 系统管理员 - 拥有所有权限
     */
    ROLE_ADMIN("系统管理员"),

    /**
     * 内容管理员 - 管理词汇、文章、语法内容
     */
    ROLE_CONTENT_MANAGER("内容管理员"),

    /**
     * 审核员 - 审核用户生成内容
     */
    ROLE_MODERATOR("审核员"),

    /**
     * 普通用户 - 学习者
     */
    ROLE_USER("普通用户");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
