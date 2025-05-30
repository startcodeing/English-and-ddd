package com.englishlearning.config;

import org.axonframework.eventhandling.EventBus;
import org.axonframework.eventhandling.SimpleEventBus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import lombok.extern.slf4j.Slf4j;

/**
 * Axon框架配置类
 * 由于禁用了AxonServer (axon.axonserver.enabled=false)，
 * 需要手动配置EventBus
 */
@Configuration
@Slf4j
public class AxonConfig {
    
    /**
     * 配置EventBus
     * 当禁用AxonServer时，需要提供一个EventBus的实现
     *
     * @return EventBus实例
     */
    @Bean
    @Primary
    public EventBus eventBus() {
        log.info("Creating EventBus bean in boot module");
        return SimpleEventBus.builder().build();
    }
}