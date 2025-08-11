package com.englishlearning.domain.content.event;

/**
 * 语法分析事件发布接口
 */
public interface GrammarAnalysisEventPublisher {
    
    /**
     * 发布语法分析创建事件
     */
    void publishGrammarAnalysisCreatedEvent(GrammarAnalysisCreatedEvent event);
    
    /**
     * 发布语法分析更新事件
     */
    void publishGrammarAnalysisUpdatedEvent(GrammarAnalysisUpdatedEvent event);
    
    /**
     * 发布语法分析删除事件
     */
    void publishGrammarAnalysisDeletedEvent(GrammarAnalysisDeletedEvent event);
    
    /**
     * 发布语法分析批量删除事件
     */
    void publishGrammarAnalysisBatchDeletedEvent(GrammarAnalysisBatchDeletedEvent event);
}