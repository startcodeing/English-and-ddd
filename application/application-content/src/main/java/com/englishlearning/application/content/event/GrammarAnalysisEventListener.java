package com.englishlearning.application.content.event;

import com.englishlearning.domain.content.event.GrammarAnalysisCreatedEvent;
import com.englishlearning.domain.content.event.GrammarAnalysisUpdatedEvent;
import com.englishlearning.domain.content.event.GrammarAnalysisDeletedEvent;
import com.englishlearning.domain.content.event.GrammarAnalysisBatchDeletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * 语法分析事件监听器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GrammarAnalysisEventListener {

    /**
     * 处理语法分析创建事件
     *
     * @param event 语法分析创建事件
     */
    @EventListener
    public void handleGrammarAnalysisCreatedEvent(GrammarAnalysisCreatedEvent event) {
        log.info("Handling grammar analysis created event: {}", event);
        // 在这里添加业务逻辑，例如：
        // 1. 记录操作日志
        // 2. 发送通知
        // 3. 更新统计信息
        // 4. 触发其他业务流程
    }

    /**
     * 处理语法分析更新事件
     *
     * @param event 语法分析更新事件
     */
    @EventListener
    public void handleGrammarAnalysisUpdatedEvent(GrammarAnalysisUpdatedEvent event) {
        log.info("Handling grammar analysis updated event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理语法分析删除事件
     *
     * @param event 语法分析删除事件
     */
    @EventListener
    public void handleGrammarAnalysisDeletedEvent(GrammarAnalysisDeletedEvent event) {
        log.info("Handling grammar analysis deleted event: {}", event);
        // 在这里添加业务逻辑
    }

    /**
     * 处理语法分析批量删除事件
     *
     * @param event 语法分析批量删除事件
     */
    @EventListener
    public void handleGrammarAnalysisBatchDeletedEvent(GrammarAnalysisBatchDeletedEvent event) {
        log.info("Handling grammar analysis batch deleted event: {}", event);
        // 在这里添加业务逻辑
    }
}