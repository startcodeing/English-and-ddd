package com.englishlearning.interfaces.content.controller;

import com.englishlearning.application.content.dto.WritingTopicDTO;
import com.englishlearning.application.content.service.WritingTopicApplicationService;
import com.englishlearning.common.types.PageRequest;
import com.englishlearning.common.types.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 写作主题管理接口
 */
@RestController
@RequestMapping("/api/v1/writing-topics")
@RequiredArgsConstructor
public class WritingTopicController {
    
    private final WritingTopicApplicationService writingTopicService;
    
    /**
     * 创建写作主题
     */
    @PostMapping
    public Result<WritingTopicDTO> createWritingTopic(@Valid @RequestBody WritingTopicDTO writingTopicDTO) {
        return Result.success(writingTopicService.createWritingTopic(writingTopicDTO));
    }
    
    /**
     * 更新写作主题
     */
    @PutMapping("/{id}")
    public Result<WritingTopicDTO> updateWritingTopic(@PathVariable Long id, @Valid @RequestBody WritingTopicDTO writingTopicDTO) {
        writingTopicDTO.setId(id);
        return Result.success(writingTopicService.updateWritingTopic(writingTopicDTO));
    }
    
    /**
     * 获取写作主题详情
     */
    @GetMapping("/{id}")
    public Result<WritingTopicDTO> getWritingTopic(@PathVariable Long id) {
        return writingTopicService.findWritingTopicById(id)
                .map(Result::success)
                .orElse(Result.failure("写作主题不存在: " + id));
    }
    
    /**
     * 获取所有写作主题
     */
    @GetMapping
    public Result<List<WritingTopicDTO>> getAllWritingTopics() {
        return Result.success(writingTopicService.findAllWritingTopics());
    }
    
    /**
     * 分页查询写作主题
     */
    @GetMapping("/page")
    public Result<List<WritingTopicDTO>> getWritingTopicsByPage(@Valid PageRequest pageRequest) {
        return Result.success(writingTopicService.findWritingTopicsByPage(pageRequest));
    }
    
    /**
     * 根据条件分页查询写作主题
     */
    @GetMapping("/search")
    public Result<List<WritingTopicDTO>> searchWritingTopics(
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String difficulty,
            @Valid PageRequest pageRequest) {
        return Result.success(writingTopicService.findWritingTopicsByCondition(
                description, source, difficulty, pageRequest));
    }
    
    /**
     * 获取写作主题总数
     */
    @GetMapping("/count")
    public Result<Long> countWritingTopics() {
        return Result.success(writingTopicService.countWritingTopics());
    }
    
    /**
     * 根据条件获取写作主题总数
     */
    @GetMapping("/count/search")
    public Result<Long> countWritingTopicsByCondition(
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String difficulty) {
        return Result.success(writingTopicService.countWritingTopicsByCondition(
                description, source, difficulty));
    }
    
    /**
     * 删除写作主题
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteWritingTopic(@PathVariable Long id) {
        writingTopicService.deleteWritingTopic(id);
        return Result.success();
    }
    
    /**
     * 批量删除写作主题
     */
    @DeleteMapping("/batch")
    public Result<Void> batchDeleteWritingTopics(@RequestBody List<Long> ids) {
        writingTopicService.batchDeleteWritingTopics(ids);
        return Result.success();
    }
}