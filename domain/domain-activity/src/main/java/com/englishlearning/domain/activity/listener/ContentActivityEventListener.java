package com.englishlearning.domain.activity.listener;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * 内容模块用户活动事件监听器
 * 
 * 注意：此类已被拆分为以下四个独立的监听器类：
 * 1. SentenceActivityEventListener - 处理句子相关事件
 * 2. ArticleActivityEventListener - 处理文章相关事件
 * 3. WritingTopicActivityEventListener - 处理写作主题相关事件
 * 4. ListeningMaterialActivityEventListener - 处理听力资料相关事件
 * 
 * 此类保留为空类仅为兼容性目的，新代码应直接使用上述拆分后的类。
 */
@Component
@Profile("spring-event-handler")
public class ContentActivityEventListener {
    // 此类已被拆分为多个独立的监听器类，保留为空类仅为兼容性目的
}