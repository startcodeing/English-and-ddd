package com.englishlearning.interfaces.content.controller;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.content.service.SentenceApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.common.types.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 句子管理接口
 */
@RestController
@RequestMapping("/api/v1/sentences")
@RequiredArgsConstructor
public class SentenceController {
    
    private final SentenceApplicationService sentenceService;
    
    /**
     * 创建句子
     */
    @PostMapping
    public Result<SentenceDTO> createSentence(@Valid @RequestBody SentenceDTO sentenceDTO) {
        return Result.success(sentenceService.createSentence(sentenceDTO));
    }
    
    /**
     * 更新句子
     */
    @PutMapping("/{id}")
    public Result<SentenceDTO> updateSentence(@PathVariable String id, @Valid @RequestBody SentenceDTO sentenceDTO) {
        sentenceDTO.setId(id);
        return Result.success(sentenceService.updateSentence(sentenceDTO));
    }
    
    /**
     * 获取句子详情
     */
    @GetMapping("/{id}")
    public Result<SentenceDTO> getSentence(@PathVariable String id) {
        return sentenceService.findSentenceById(id)
            .map(Result::success)
            .orElse(Result.failure("句子不存在"));
    }
    
    /**
     * 获取所有句子
     */
    @GetMapping
    public Result<List<SentenceDTO>> getAllSentences() {
        return Result.success(sentenceService.findAllSentences());
    }
    
    /**
     * 根据英文内容查询句子
     */
    @GetMapping("/search/english")
    public Result<List<SentenceDTO>> searchByEnglishContent(@RequestParam String content) {
        return Result.success(sentenceService.findSentencesByEnglishContent(content));
    }
    
    /**
     * 根据中文意思查询句子
     */
    @GetMapping("/search/chinese")
    public Result<List<SentenceDTO>> searchByChineseMeaning(@RequestParam String meaning) {
        return Result.success(sentenceService.findSentencesByChineseMeaning(meaning));
    }
    
    /**
     * 为句子添加变体
     */
    @PostMapping("/{id}/variants")
    public Result<SentenceDTO> addVariant(@PathVariable String id, @Valid @RequestBody SentenceVariantDTO variantDTO) {
        return Result.success(sentenceService.addVariant(id, variantDTO));
    }
    
    /**
     * 为句子添加陌生单词
     */
    @PostMapping("/{id}/unfamiliar-words")
    public Result<SentenceDTO> addUnfamiliarWord(@PathVariable String id, @Valid @RequestBody WordDTO wordDTO) {
        return Result.success(sentenceService.addUnfamiliarWord(id, wordDTO));
    }
    
    /**
     * 移除句子的陌生单词
     */
//    @DeleteMapping("/{id}/unfamiliar-words/{wordId}")
//    public Result<SentenceDTO> removeUnfamiliarWord(@PathVariable String id, @PathVariable String wordId) {
//        return Result.success(sentenceService.removeUnfamiliarWord(id, wordId));
//    }
    
    /**
     * 分析句子结构
     */
//    @GetMapping("/{id}/grammar-analysis")
//    public Result<String> analyzeSentenceGrammar(@PathVariable String id) {
//        return Result.success(sentenceService.analyzeSentenceGrammar(id));
//    }
    
    /**
     * 删除句子
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteSentence(@PathVariable String id) {
        sentenceService.deleteSentence(id);
        return Result.success();
    }
} 