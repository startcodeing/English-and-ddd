package com.englishlearning.domain.activity.listener;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * 词汇模块用户活动事件监听器
 * 注意：该类已被拆分为以下三个子类：
 * - WordActivityEventListener：处理单词相关事件
 * - WordBookActivityEventListener：处理单词本相关事件
 * - PartOfSpeechActivityEventListener：处理词性相关事件
 * 
 * 该类保留仅作为兼容性目的，不再包含任何实际功能。
 */
@Component
@Profile("spring-event-handler")
public class VocabularyActivityEventListener {
    // 该类已被拆分为三个子类，不再包含任何实际功能
}