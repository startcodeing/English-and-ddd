package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.content.event.GrammarAnalysisCreatedEvent;
import com.englishlearning.domain.content.event.GrammarAnalysisUpdatedEvent;
import com.englishlearning.domain.content.event.GrammarAnalysisDeletedEvent;
import com.englishlearning.domain.content.event.GrammarAnalysisBatchDeletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * 语法分析活动事件监听器
 * 监听语法分析相关事件并记录用户活动
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GrammarAnalysisActivityEventListener {
    
    private final UserActivityService userActivityService;
    
    /**
     * 监听语法分析创建事件
     */
    @EventListener
    public void handleGrammarAnalysisCreatedEvent(GrammarAnalysisCreatedEvent event) {
        log.info("Handling grammar analysis created event: {}", event.getGrammarAnalysis().getTitle());
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.GRAMMAR_ANALYSIS_CREATED,
            "创建语法分析：" + event.getGrammarAnalysis().getTitle(),
            event.getGrammarAnalysis().getId().toString(),
            "grammar_analysis"
        );
    }
    
    /**
     * 监听语法分析更新事件
     */
    @EventListener
    public void handleGrammarAnalysisUpdatedEvent(GrammarAnalysisUpdatedEvent event) {
        log.info("Handling grammar analysis updated event: {}", event.getGrammarAnalysis().getTitle());
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.GRAMMAR_ANALYSIS_UPDATED,
            "更新语法分析：" + event.getGrammarAnalysis().getTitle(),
            event.getGrammarAnalysis().getId().toString(),
            "grammar_analysis"
        );
    }
    
    /**
     * 监听语法分析删除事件
     */
    @EventListener
    public void handleGrammarAnalysisDeletedEvent(GrammarAnalysisDeletedEvent event) {
        log.info("Handling grammar analysis deleted event: {}", event.getGrammarAnalysis().getTitle());
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.GRAMMAR_ANALYSIS_DELETED,
            "删除语法分析：" + event.getGrammarAnalysis().getTitle(),
            event.getGrammarAnalysis().getId().toString(),
            "grammar_analysis"
        );
    }
    
    /**
     * 监听语法分析批量删除事件
     */
    @EventListener
    public void handleGrammarAnalysisBatchDeletedEvent(GrammarAnalysisBatchDeletedEvent event) {
        log.info("Handling grammar analysis batch deleted event: {} items", event.getGrammarAnalysisIds().size());
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.GRAMMAR_ANALYSIS_BATCH_DELETED,
            "批量删除语法分析",
            "批量删除了 " + event.getGrammarAnalysisIds().size() + " 个语法分析",
            String.join(",", event.getGrammarAnalysisIds().stream().map(String::valueOf).toArray(String[]::new)),
            "grammar_analysis"
        );
    }
}