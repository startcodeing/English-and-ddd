package com.englishlearning;

import com.englishlearning.config.CorsConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * 英语学习平台启动类
 */
@SpringBootApplication(scanBasePackages = {"com.englishlearning"})
@EntityScan(basePackages = {"com.englishlearning.infrastructure.db.po", "com.englishlearning.infrastructure.activity.po"})
@EnableJpaRepositories(basePackages = {"com.englishlearning.infrastructure.db.repository", "com.englishlearning.infrastructure.activity.repository.jpa"})
@EnableJpaAuditing
@Import({CorsConfig.class})
public class EnglishLearningApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(EnglishLearningApplication.class, args);
    }
}