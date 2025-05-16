package com.englishlearning.interfaces.api.vocabulary.controller;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.service.WordApplicationService;
import com.englishlearning.common.constants.ApiConstants;
import com.englishlearning.common.types.Result;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 单词控制器
 */
@RestController
@RequestMapping(ApiConstants.VOCABULARY_API + "/word")
public class WordController {
    
    private final WordApplicationService wordService;
    
    public WordController(WordApplicationService wordService) {
        this.wordService = wordService;
    }
    
    /**
     * 创建单词
     */
    @PostMapping
    public Result<WordDTO> createWord(@Valid @RequestBody WordDTO dto) {
        return wordService.createWord(dto);
    }
    
    /**
     * 更新单词
     */
    @PutMapping("/{id}")
    public Result<WordDTO> updateWord(@PathVariable String id, @Valid @RequestBody WordDTO dto) {
        return wordService.updateWord(id, dto);
    }
    
    /**
     * 获取单词详情
     */
    @GetMapping("/{id}")
    public Result<WordDTO> getWord(@PathVariable String id) {
        return wordService.getWord(id);
    }
    
    /**
     * 根据拼写查找单词
     */
    @GetMapping("/spelling/{spelling}")
    public Result<WordDTO> getWordBySpelling(@PathVariable String spelling) {
        return wordService.getWordBySpelling(spelling);
    }
    
    /**
     * 根据中文意思模糊查询单词
     */
    @GetMapping("/search")
    public Result<List<WordDTO>> searchWordsByMeaning(@RequestParam String meaning) {
        return wordService.searchWordsByMeaning(meaning);
    }
    
    /**
     * 根据词性ID查询单词列表
     */
    @GetMapping("/part-of-speech/{partOfSpeechId}")
    public Result<List<WordDTO>> getWordsByPartOfSpeech(@PathVariable String partOfSpeechId) {
        return wordService.getWordsByPartOfSpeech(partOfSpeechId);
    }
    
    /**
     * 获取所有单词
     */
    @GetMapping
    public Result<List<WordDTO>> getAllWords() {
        return wordService.getAllWords();
    }
    
    /**
     * 删除单词
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteWord(@PathVariable String id) {
        return wordService.deleteWord(id);
    }
}