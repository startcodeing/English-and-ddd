package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.GrammarAnalysis;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 语法分析更新事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarAnalysisUpdatedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 语法分析
     */
    private GrammarAnalysis grammarAnalysis;
}