package com.englishlearning.domain.content.model.enums;

/**
 * 难度级别枚举
 */
public enum DifficultyLevel {
    EASY("easy", "简单"),
    MEDIUM("medium", "中等"),
    HARD("hard", "困难");
    
    private final String code;
    private final String description;
    
    DifficultyLevel(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * 根据code获取枚举值
     */
    public static DifficultyLevel fromCode(String code) {
        for (DifficultyLevel level : DifficultyLevel.values()) {
            if (level.getCode().equals(code)) {
                return level;
            }
        }
        throw new IllegalArgumentException("Unknown difficulty level code: " + code);
    }
}