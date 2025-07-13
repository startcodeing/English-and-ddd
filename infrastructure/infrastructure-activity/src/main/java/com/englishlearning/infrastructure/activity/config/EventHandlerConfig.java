package com.englishlearning.infrastructure.activity.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * 事件处理器配置类
 * 用于配置使用哪种事件处理器实现
 * 
 * 通过Spring的@Profile注解来控制激活哪种事件处理器：
 * - spring-event-handler: 激活基于Spring的事件处理器
 * - axon-event-handler: 激活基于Axon的事件处理器
 */
@Configuration
public class EventHandlerConfig {
    
    // 配置类主要通过@Profile注解来控制激活哪种事件处理器
    // 具体的处理器实现类上已经添加了相应的@Profile注解
    
}