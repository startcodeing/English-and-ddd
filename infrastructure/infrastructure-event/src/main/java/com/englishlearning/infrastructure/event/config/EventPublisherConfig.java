package com.englishlearning.infrastructure.event.config;

import com.englishlearning.infrastructure.event.publisher.AxonEventPublisher;
import com.englishlearning.infrastructure.event.publisher.DomainEventPublisher;
import com.englishlearning.infrastructure.event.publisher.SpringEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

/**
 * 事件发布器配置类
 * 用于配置使用哪种事件发布器实现
 */
@Configuration
public class EventPublisherConfig {
    
    /**
     * 配置Spring事件发布器
     * 只在spring-event-handler配置文件激活时创建
     * 
     * @param springEventPublisher Spring事件发布器
     * @return Spring事件发布器
     */
    @Bean
    @Primary
    @Profile("spring-event-handler")
    public DomainEventPublisher springDomainEventPublisher(
            SpringEventPublisher springEventPublisher) {
        return springEventPublisher;
    }
    
    /**
     * 配置Axon事件发布器
     * 只在axon-event-handler配置文件激活时创建
     * 
     * @param axonEventPublisher Axon事件发布器
     * @return Axon事件发布器
     */
    @Bean
    @Primary
    @Profile("axon-event-handler")
    public DomainEventPublisher axonDomainEventPublisher(
            AxonEventPublisher axonEventPublisher) {
        return axonEventPublisher;
    }
}