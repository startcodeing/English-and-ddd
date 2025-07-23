package com.englishlearning.common.utils;

/**
 * 用户上下文工具类
 * 用于获取当前用户信息
 */
public class UserContext {
    
    // 临时实现，实际项目中应该从安全上下文或请求上下文中获取
    
    /**
     * 获取当前用户ID
     * 
     * @return 当前用户ID
     */
    public static Long getCurrentUserId() {
        // 临时返回默认值，实际项目中应该从安全上下文中获取
        return 1L;
    }
    
    /**
     * 获取当前用户名
     * 
     * @return 当前用户名
     */
    public static String getCurrentUsername() {
        // 临时返回默认值，实际项目中应该从安全上下文中获取
        return "admin";
    }
}