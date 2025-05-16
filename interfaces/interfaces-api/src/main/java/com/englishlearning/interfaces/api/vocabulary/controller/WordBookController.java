package com.englishlearning.interfaces.api.vocabulary.controller;

import com.englishlearning.application.vocabulary.dto.WordBookDTO;
import com.englishlearning.application.vocabulary.service.WordBookApplicationService;
import com.englishlearning.common.constants.ApiConstants;
import com.englishlearning.common.types.Result;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 单词本控制器
 */
@RestController
@RequestMapping(ApiConstants.VOCABULARY_API + "/wordbook")
public class WordBookController {
    
    private final WordBookApplicationService wordBookService;
    
    public WordBookController(WordBookApplicationService wordBookService) {
        this.wordBookService = wordBookService;
    }
    
    /**
     * 创建单词本
     */
    @PostMapping
    public Result<WordBookDTO> createWordBook(@Valid @RequestBody WordBookDTO dto) {
        return wordBookService.createWordBook(dto);
    }
    
    /**
     * 更新单词本
     */
    @PutMapping("/{id}")
    public Result<WordBookDTO> updateWordBook(@PathVariable String id, @Valid @RequestBody WordBookDTO dto) {
        return wordBookService.updateWordBook(id, dto);
    }
    
    /**
     * 获取单词本详情
     */
    @GetMapping("/{id}")
    public Result<WordBookDTO> getWordBook(@PathVariable String id) {
        return wordBookService.getWordBook(id);
    }
    
    /**
     * 根据名称查找单词本
     */
    @GetMapping("/name/{name}")
    public Result<WordBookDTO> getWordBookByName(@PathVariable String name) {
        return wordBookService.getWordBookByName(name);
    }
    
    /**
     * 获取所有单词本
     */
    @GetMapping
    public Result<List<WordBookDTO>> getAllWordBooks() {
        return wordBookService.getAllWordBooks();
    }
    
    /**
     * 删除单词本
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteWordBook(@PathVariable String id) {
        return wordBookService.deleteWordBook(id);
    }
    
    /**
     * 向单词本添加单词
     */
    @PostMapping("/{id}/words")
    public Result<Void> addWordToWordBook(@PathVariable String id, @RequestBody List<String> wordIds) {
        return wordBookService.addWordsToWordBook(id, wordIds);
    }
    
    /**
     * 从单词本移除单词
     */
    @DeleteMapping("/{id}/words/{wordId}")
    public Result<Void> removeWordFromWordBook(@PathVariable String id, @PathVariable String wordId) {
        return wordBookService.removeWordFromWordBook(id, wordId);
    }
    
    /**
     * 获取单词本中的所有单词
     */
    @GetMapping("/{id}/words")
    public Result<List<WordBookDTO>> getWordsInWordBook(@PathVariable String id) {
        return wordBookService.getWordsInWordBook(id);
    }
}