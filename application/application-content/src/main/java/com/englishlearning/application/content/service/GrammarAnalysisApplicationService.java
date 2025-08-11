package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.GrammarAnalysisDTO;

import java.util.List;
import java.util.Optional;

/**
 * 语法分析应用服务接口
 */
public interface GrammarAnalysisApplicationService {
    
    /**
     * 创建语法分析
     */
    GrammarAnalysisDTO createGrammarAnalysis(GrammarAnalysisDTO grammarAnalysisDTO);
    
    /**
     * 更新语法分析
     */
    GrammarAnalysisDTO updateGrammarAnalysis(Long id, GrammarAnalysisDTO grammarAnalysisDTO);
    
    /**
     * 删除语法分析
     */
    void deleteGrammarAnalysis(Long id);
    
    /**
     * 根据ID查找语法分析
     */
    Optional<GrammarAnalysisDTO> findGrammarAnalysisById(Long id);
    
    /**
     * 查找所有语法分析
     */
    List<GrammarAnalysisDTO> findAllGrammarAnalyses();
    
    /**
     * 根据条件分页查询语法分析
     */
    List<GrammarAnalysisDTO> findGrammarAnalysesByCondition(String title, String difficulty, int page, int size);
    
    /**
     * 根据条件统计语法分析数量
     */
    long countGrammarAnalysisByCondition(String title, Integer difficulty);
    
    /**
     * 批量删除语法分析
     */
    void batchDeleteGrammarAnalyses(List<Long> ids);
}