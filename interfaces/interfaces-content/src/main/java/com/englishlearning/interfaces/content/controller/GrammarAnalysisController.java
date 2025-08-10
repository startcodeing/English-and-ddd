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
        grammarAnalysisDTO.setId(id);
        return Result.success(grammarAnalysisService.updateGrammarAnalysis(grammarAnalysisDTO));
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
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(grammarAnalysisService.findGrammarAnalysisByCondition(title, difficulty, page, size));
    }

    @GetMapping("/count")
    public Result<Long> countGrammarAnalysis(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String difficulty) {
        return Result.success(grammarAnalysisService.countGrammarAnalysisByCondition(title, difficulty));
    }
}