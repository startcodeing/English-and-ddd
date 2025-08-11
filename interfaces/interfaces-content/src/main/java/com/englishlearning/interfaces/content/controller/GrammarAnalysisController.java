package com.englishlearning.interfaces.content.controller;

import com.englishlearning.application.content.dto.GrammarAnalysisDTO;
import com.englishlearning.application.content.service.GrammarAnalysisApplicationService;
import com.englishlearning.common.types.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grammar-analysis")
@RequiredArgsConstructor
public class GrammarAnalysisController {

    private final GrammarAnalysisApplicationService grammarAnalysisService;

    @PostMapping
    public Result<GrammarAnalysisDTO> createGrammarAnalysis(@RequestBody GrammarAnalysisDTO grammarAnalysisDTO) {
        return Result.success(grammarAnalysisService.createGrammarAnalysis(grammarAnalysisDTO));
    }

    @PutMapping("/{id}")
    public Result<GrammarAnalysisDTO> updateGrammarAnalysis(@PathVariable Long id, @RequestBody GrammarAnalysisDTO grammarAnalysisDTO) {
        return Result.success(grammarAnalysisService.updateGrammarAnalysis(id, grammarAnalysisDTO));
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteGrammarAnalysis(@PathVariable Long id) {
        grammarAnalysisService.deleteGrammarAnalysis(id);
        return Result.success();
    }

    @GetMapping("/{id}")
    public Result<GrammarAnalysisDTO> getGrammarAnalysis(@PathVariable Long id) {
        return grammarAnalysisService.findGrammarAnalysisById(id)
                .map(Result::success)
                .orElse(Result.failure("Grammar analysis not found: " + id));
    }

    @GetMapping("/search")
    public Result<List<GrammarAnalysisDTO>> searchGrammarAnalysis(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String difficultyStr = difficulty != null ? difficulty.toString() : null;
        return Result.success(grammarAnalysisService.findGrammarAnalysesByCondition(title, difficultyStr, page, size));
    }

    @GetMapping("/count")
    public Result<Long> countGrammarAnalysis(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer difficulty) {
        return Result.success(grammarAnalysisService.countGrammarAnalysisByCondition(title, difficulty));
    }

    /**
     * 批量删除语法分析
     */
    @DeleteMapping("/batch")
    public Result<Void> batchDeleteGrammarAnalyses(@RequestBody BatchDeleteRequest request) {
        grammarAnalysisService.batchDeleteGrammarAnalyses(request.getIds());
        return Result.success();
    }

    /**
     * 批量删除请求对象
     */
    @lombok.Data
    public static class BatchDeleteRequest {
        private List<Long> ids;
    }
}