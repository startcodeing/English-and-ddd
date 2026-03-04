package com.englishlearning.common.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 用户上下文工具类
 * 用于获取当前用户信息
 *
 * 集成Spring Security，保持向后兼容
 */
public class UserContext {

    private UserContext() {
        // 工具类，禁止实例化
    }

    /**
     * 获取当前用户ID
     *
     * @return 当前用户ID，如果未认证则返回默认值1L（向后兼容）
     */
    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
            return userPrincipal.getId();
        }

        // 默认值，向后兼容未认证的情况
        return 1L;
    }

    /**
     * 获取当前用户名
     *
     * @return 当前用户名，如果未认证则返回默认值"admin"（向后兼容）
     */
    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
            return userPrincipal.getUsername();
        }

        // 默认值，向后兼容未认证的情况
        return "admin";
    }

    /**
     * 检查当前用户是否已认证
     *
     * @return 是否已认证
     */
    public static boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() &&
               !(auth.getPrincipal() instanceof String);
    }

    /**
     * 获取当前认证对象
     *
     * @return Authentication对象
     */
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * 用户认证信息接口
     * 简化版本，用于避免循环依赖
     */
    public interface UserPrincipal {
        Long getId();
        String getUsername();
    }
}