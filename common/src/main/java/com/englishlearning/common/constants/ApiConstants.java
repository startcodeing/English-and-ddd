package com.englishlearning.common.constants;

/**
 * API常量定义
 */
public class ApiConstants {
    
    /**
     * 接口版本
     */
    public static final String API_VERSION = "v1";
    
    /**
     * API前缀
     */
    public static final String API_PREFIX = "/api/" + API_VERSION;
    
    /**
     * 词汇管理模块
     */
    public static final String VOCABULARY_API = API_PREFIX + "/vocabulary";
    
    /**
     * 内容管理模块
     */
    public static final String CONTENT_API = API_PREFIX + "/content";
    
    /**
     * 听写测试模块
     */
    public static final String DICTATION_API = API_PREFIX + "/dictation";
    
    /**
     * 写作练习模块
     */
    public static final String WRITING_API = API_PREFIX + "/writing";
    
    private ApiConstants() {
        // 防止实例化
    }
} 