package com.englishlearning.interfaces.practice.controller;

import com.englishlearning.application.practice.dto.DictationPracticeDTO;
import com.englishlearning.application.practice.dto.DictationPracticeQueryDTO;
import com.englishlearning.application.practice.service.DictationPracticeApplicationService;
import com.englishlearning.common.types.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 听写练习控制器
 */
@RestController
@RequestMapping("/api/practice/dictation")
@RequiredArgsConstructor
public class DictationPracticeController {
    
    private final DictationPracticeApplicationService dictationPracticeApplicationService;
    
    /**
     * 创建听写练习
     */
    @PostMapping
    public Result<DictationPracticeDTO> create(@Valid @RequestBody DictationPracticeDTO dictationPracticeDTO) {
        // 这里需要获取当前用户信息，暂时使用占位符
        String userId = "1";
        String username = "admin";
        DictationPracticeDTO result = dictationPracticeApplicationService.create(dictationPracticeDTO, userId, username);
        return Result.success(result);
    }
    
    /**
     * 更新听写练习
     */
    @PutMapping("/{id}")
    public Result<DictationPracticeDTO> update(@PathVariable Long id, @Valid @RequestBody DictationPracticeDTO dictationPracticeDTO) {
        dictationPracticeDTO.setId(id);
        // 这里需要获取当前用户信息，暂时使用占位符
        String userId = "1";
        String username = "admin";
        DictationPracticeDTO result = dictationPracticeApplicationService.update(dictationPracticeDTO, userId, username);
        return Result.success(result);
    }
    
    /**
     * 提交听写练习
     */
    @PostMapping("/{id}/submit")
    public Result<DictationPracticeDTO> submit(@PathVariable Long id) {
        // 这里需要获取当前用户信息，暂时使用占位符
        String userId = "1";
        String username = "admin";
        DictationPracticeDTO result = dictationPracticeApplicationService.submit(id, userId, username);
        return Result.success(result);
    }
    
    /**
     * 评分听写练习
     */
    @PostMapping("/{id}/score")
    public Result<DictationPracticeDTO> score(@PathVariable Long id, @RequestParam Integer score) {
        // 这里需要获取当前用户信息，暂时使用占位符
        String userId = "1";
        String username = "admin";
        DictationPracticeDTO result = dictationPracticeApplicationService.score(id, score, userId, username);
        return Result.success(result);
    }
    
    /**
     * 根据ID查询听写练习
     */
    @GetMapping("/{id}")
    public Result<DictationPracticeDTO> findById(@PathVariable Long id) {
        DictationPracticeDTO result = dictationPracticeApplicationService.findById(id);
        return Result.success(result);
    }
    
    /**
     * 分页查询听写练习
     */
    @GetMapping
    public Result<List<DictationPracticeDTO>> findByPage(@Valid DictationPracticeQueryDTO queryDTO) {
        List<DictationPracticeDTO> result = dictationPracticeApplicationService.findByPage(queryDTO);
        return Result.success(result);
    }
    
    /**
     * 统计听写练习数量
     */
    @GetMapping("/count")
    public Result<Long> count(@Valid DictationPracticeQueryDTO queryDTO) {
        Long result = dictationPracticeApplicationService.count(queryDTO);
        return Result.success(result);
    }
    
    /**
     * 根据ID删除听写练习
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteById(@PathVariable Long id) {
        // 这里需要获取当前用户信息，暂时使用占位符
        String userId = "1";
        String username = "admin";
        dictationPracticeApplicationService.deleteById(id, userId, username);
        return Result.success();
    }
    
    /**
     * 批量删除听写练习
     */
    @DeleteMapping
    public Result<Void> batchDelete(@RequestBody List<Long> ids) {
        // 这里需要获取当前用户信息，暂时使用占位符
        String userId = "1";
        String username = "admin";
        dictationPracticeApplicationService.deleteByIds(ids, userId, username);
        return Result.success();
    }
}