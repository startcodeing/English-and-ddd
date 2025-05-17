package com.englishlearning.interfaces.api.vocabulary.controller;

import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.application.vocabulary.service.PartOfSpeechApplicationService;
import com.englishlearning.common.constants.ApiConstants;
import com.englishlearning.common.types.Result;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 词性控制器
 */
@RestController
@RequestMapping(ApiConstants.VOCABULARY_API + "/part-of-speech")
public class PartOfSpeechController {
    
    private final PartOfSpeechApplicationService partOfSpeechService;
    
    public PartOfSpeechController(PartOfSpeechApplicationService partOfSpeechService) {
        this.partOfSpeechService = partOfSpeechService;
    }
    
    /**
     * 创建词性
     */
    @PostMapping
    public Result<PartOfSpeechDTO> createPartOfSpeech(@Valid @RequestBody PartOfSpeechDTO dto) {
        return Result.success(partOfSpeechService.createPartOfSpeech(dto));
    }
    
    /**
     * 更新词性
     */
    @PutMapping("/{id}")
    public Result<PartOfSpeechDTO> updatePartOfSpeech(@Valid @RequestBody PartOfSpeechDTO dto) {
        return Result.success(partOfSpeechService.updatePartOfSpeech(dto));
    }
    
    /**
     * 获取词性详情
     */
    @GetMapping("/{id}")
    public Result<PartOfSpeechDTO> getPartOfSpeech(@PathVariable String id) {
        return Result.success(partOfSpeechService.getPartOfSpeech(id));
    }
    
    /**
     * 获取所有词性
     */
    @GetMapping
    public Result<List<PartOfSpeechDTO>> getAllPartOfSpeech() {
        return Result.success(partOfSpeechService.getAllPartOfSpeech());
    }
    
    /**
     * 删除词性
     */
    @DeleteMapping("/{id}")
    public Result<Void> deletePartOfSpeech(@PathVariable String id) {
        partOfSpeechService.deletePartOfSpeech(id);
        return Result.success();
    }
} 