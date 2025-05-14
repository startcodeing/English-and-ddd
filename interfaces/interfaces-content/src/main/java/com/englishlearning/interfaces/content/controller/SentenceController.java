package com.englishlearning.interfaces.content.controller;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.content.service.SentenceApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.common.response.CommonResult;
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
    public CommonResult<SentenceDTO> createSentence(@Valid @RequestBody SentenceDTO sentenceDTO) {
        return CommonResult.success(sentenceService.createSentence(sentenceDTO));
    }
    
    /**
     * 更新句子
     */
    @PutMapping("/{id}")
    public CommonResult<SentenceDTO> updateSentence(@PathVariable String id, @Valid @RequestBody SentenceDTO sentenceDTO) {
        sentenceDTO.setId(id);
        return CommonResult.success(sentenceService.updateSentence(sentenceDTO));
    }
    
    /**
     * 获取句子详情
     */
    @GetMapping("/{id}")
    public CommonResult<SentenceDTO> getSentence(@PathVariable String id) {
        return sentenceService.findSentenceById(id)
            .map(CommonResult::success)
            .orElse(CommonResult.failed("句子不存在"));
    }
    
    /**
     * 获取所有句子
     */
    @GetMapping
    public CommonResult<List<SentenceDTO>> getAllSentences() {
        return CommonResult.success(sentenceService.findAllSentences());
    }
    
    /**
     * 根据英文内容查询句子
     */
    @GetMapping("/search/english")
    public CommonResult<List<SentenceDTO>> searchByEnglishContent(@RequestParam String content) {
        return CommonResult.success(sentenceService.findSentencesByEnglishContent(content));
    }
    
    /**
     * 根据中文意思查询句子
     */
    @GetMapping("/search/chinese")
    public CommonResult<List<SentenceDTO>> searchByChineseMeaning(@RequestParam String meaning) {
        return CommonResult.success(sentenceService.findSentencesByChineseMeaning(meaning));
    }
    
    /**
     * 为句子添加变体
     */
    @PostMapping("/{id}/variants")
    public CommonResult<SentenceDTO> addVariant(@PathVariable String id, @Valid @RequestBody SentenceVariantDTO variantDTO) {
        return CommonResult.success(sentenceService.addVariant(id, variantDTO));
    }
    
    /**
     * 为句子添加陌生单词
     */
    @PostMapping("/{id}/unfamiliar-words")
    public CommonResult<SentenceDTO> addUnfamiliarWord(@PathVariable String id, @Valid @RequestBody WordDTO wordDTO) {
        return CommonResult.success(sentenceService.addUnfamiliarWord(id, wordDTO));
    }
    
    /**
     * 移除句子的陌生单词
     */
    @DeleteMapping("/{id}/unfamiliar-words/{wordId}")
    public CommonResult<SentenceDTO> removeUnfamiliarWord(@PathVariable String id, @PathVariable String wordId) {
        return CommonResult.success(sentenceService.removeUnfamiliarWord(id, wordId));
    }
    
    /**
     * 分析句子结构
     */
    @GetMapping("/{id}/grammar-analysis")
    public CommonResult<String> analyzeSentenceGrammar(@PathVariable String id) {
        return CommonResult.success(sentenceService.analyzeSentenceGrammar(id));
    }
    
    /**
     * 删除句子
     */
    @DeleteMapping("/{id}")
    public CommonResult<Void> deleteSentence(@PathVariable String id) {
        sentenceService.deleteSentence(id);
        return CommonResult.success(null);
    }
} 