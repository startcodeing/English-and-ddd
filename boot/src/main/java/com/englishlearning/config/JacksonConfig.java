package com.englishlearning.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Jackson配置类，用于处理日期时间格式
 */
@Configuration
public class JacksonConfig {

    private static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
    
    /**
     * 配置ObjectMapper以正确处理Java 8日期时间类型
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        
        // 注册JavaTimeModule以支持Java 8日期时间类型
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // 配置LocalDateTime的序列化和反序列化
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DATE_TIME_PATTERN);
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(dateTimeFormatter));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(dateTimeFormatter));
        
        objectMapper.registerModule(javaTimeModule);
        
        // 禁用将日期写为时间戳
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        return objectMapper;
    }
}