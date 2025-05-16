package com.englishlearning.domain.vocabulary.model.valueobject;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 用法总结值对象
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UsageSummary {
    
    private String content;
    
    /**
     * 创建用法总结
     */
    public static UsageSummary of(String content) {
        if (content == null || content.trim().isEmpty()) {
            return new UsageSummary("");
        }
        return new UsageSummary(content);
    }
    
    /**
     * 更新用法总结内容
     */
    public UsageSummary update(String newContent) {
        if (newContent == null || newContent.trim().isEmpty()) {
            return new UsageSummary("");
        }
        return new UsageSummary(newContent);
    }
    
    /**
     * 判断是否为空
     */
    public boolean isEmpty() {
        return content == null || content.trim().isEmpty();
    }
}