package com.englishlearning.interfaces.practice.controller;

import com.englishlearning.application.practice.dto.WritingPracticeDTO;
import com.englishlearning.application.practice.dto.WritingPracticeQueryDTO;
import com.englishlearning.application.practice.service.WritingPracticeApplicationService;
import com.englishlearning.common.types.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 写作练习控制器
 */
@RestController
@RequestMapping("/api/v1/writing-practices")
@RequiredArgsConstructor
public class WritingPracticeController {
    
    private final WritingPracticeApplicationService writingPracticeApplicationService;
    
    /**
     * 创建写作练习
     */
    @PostMapping
    public Result<WritingPracticeDTO> createWritingPractice(@RequestBody WritingPracticeDTO writingPracticeDTO) {
        return Result.success(writingPracticeApplicationService.createWritingPractice(writingPracticeDTO));
    }
    
    /**
     * 更新写作练习
     */
    @PutMapping("/{id}")
    public Result<WritingPracticeDTO> updateWritingPractice(
            @PathVariable Long id,
            @RequestBody WritingPracticeDTO writingPracticeDTO) {
        return Result.success(writingPracticeApplicationService.updateWritingPractice(id, writingPracticeDTO));
    }
    
    /**
     * 提交写作练习
     */
    @PutMapping("/{id}/submit")
    public Result<WritingPracticeDTO> submitWritingPractice(@PathVariable Long id) {
        return Result.success(writingPracticeApplicationService.submitWritingPractice(id));
    }
    
    /**
     * 评分写作练习
     */
    @PutMapping("/{id}/score")
    public Result<WritingPracticeDTO> scoreWritingPractice(
            @PathVariable Long id,
            @RequestParam Integer score) {
        return Result.success(writingPracticeApplicationService.scoreWritingPractice(id, score));
    }
    
    /**
     * 获取写作练习详情
     */
    @GetMapping("/{id}")
    public Result<WritingPracticeDTO> getWritingPracticeById(@PathVariable Long id) {
        return Result.success(writingPracticeApplicationService.getWritingPracticeById(id));
    }
    
    /**
     * 分页查询写作练习
     */
    @GetMapping("/search")
    public Result<List<WritingPracticeDTO>> getWritingPracticesByPage(WritingPracticeQueryDTO queryDTO) {
        return Result.success(writingPracticeApplicationService.getWritingPracticesByPage(queryDTO));
    }
    
    /**
     * 统计写作练习数量
     */
    @GetMapping("/count/search")
    public Result<Long> countWritingPractices(WritingPracticeQueryDTO queryDTO) {
        return Result.success(writingPracticeApplicationService.countWritingPractices(queryDTO));
    }
    
    /**
     * 删除写作练习
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteWritingPractice(@PathVariable Long id) {
        writingPracticeApplicationService.deleteWritingPractice(id);
        return Result.success();
    }
    
    /**
     * 批量删除写作练习
     */
    @DeleteMapping("/batch")
    public Result<Void> batchDeleteWritingPractices(@RequestBody List<Long> ids) {
        writingPracticeApplicationService.batchDeleteWritingPractices(ids);
        return Result.success();
    }
}