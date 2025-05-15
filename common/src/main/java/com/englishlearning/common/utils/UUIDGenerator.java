package com.englishlearning.common.utils;

import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * UUID生成器
 */
@Component
public class UUIDGenerator {
    
    /**
     * 生成UUID (无连字符)
     */
    public String generateUUID() {
        return UUID.randomUUID().toString().replace("-", "");
    }
} 