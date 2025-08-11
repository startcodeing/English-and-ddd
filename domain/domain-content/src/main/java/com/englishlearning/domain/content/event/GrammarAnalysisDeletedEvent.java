package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.GrammarAnalysis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 语法分析删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrammarAnalysisDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的语法分析
     */
    private GrammarAnalysis grammarAnalysis;
}