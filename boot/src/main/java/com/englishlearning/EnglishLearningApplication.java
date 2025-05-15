package com.englishlearning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * 英语学习平台启动类
 */
@SpringBootApplication
@EntityScan(basePackages = "com.englishlearning.infrastructure.db.po")
@EnableJpaRepositories(basePackages = "com.englishlearning.infrastructure.db.repository")
public class EnglishLearningApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(EnglishLearningApplication.class, args);
    }
} 