package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.GrammarAnalysis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 语法分析批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrammarAnalysisBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的语法分析ID列表
     */
    private List<Long> grammarAnalysisIds;
    
    /**
     * 被删除的语法分析列表
     */
    private List<GrammarAnalysis> grammarAnalyses;
}