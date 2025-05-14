package com.englishlearning.common.enums;

/**
 * 听写状态枚举
 */
public enum DictationStatus {
    
    /**
     * 已创建
     */
    CREATED("已创建"),
    
    /**
     * 已开始
     */
    STARTED("已开始"),
    
    /**
     * 已完成
     */
    COMPLETED("已完成"),
    
    /**
     * 已评分
     */
    GRADED("已评分");
    
    private final String description;
    
    DictationStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
} 