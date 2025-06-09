package com.englishlearning.interfaces.api.vocabulary.controller;

import com.englishlearning.application.vocabulary.dto.*;
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
        return Result.success(wordService.createWord(dto));
    }
    
    /**
     * 更新单词
     */
    @PutMapping("/{id}")
    public Result<WordDTO> updateWord(@PathVariable String id,@Valid @RequestBody WordDTO dto) {
        return Result.success(wordService.updateWord(id,dto));
    }


    /**
     * 添加词性
     */
    @PostMapping("/wordMeaning")
    public Result<WordDTO> addWordMeaning(@RequestBody WordMeaningDTO dto) {
        return Result.success(wordService.addWordMeaning(dto));
    }

    /**
     * 添加词性
     */
    @DeleteMapping("/{wordId}/wordMeaning/{wordMeaningId}")
    public Result<WordDTO> deleteWordMeaning(@PathVariable String wordId, @PathVariable String wordMeaningId) {
        return Result.success(wordService.removeWordMeaning(wordId,wordMeaningId));
    }

    /**
     * 添加词性例句
     */
    @PostMapping("/wordMeaning/exampleSentence")
    public Result<WordDTO> addWordMeaningExampleSentence(@RequestBody ExampleSentenceDTO dto) {
        return Result.success(wordService.addExampleSentence(dto));
    }

    /**
     * 添加词性同义词
     */
    @PostMapping("/wordMeaning/addSynonym")
    public Result<WordMeaningDTO> addWordMeaningSynonym(@RequestBody SynonymDTO synonymDTO) {
        return Result.success(wordService.addSynonym(synonymDTO.getWordId(),synonymDTO.getWordMeaningId(),synonymDTO.getSynonymWordId(),synonymDTO.getSynonymWordMeaningId()));
    }

    /**
     * 添加词性反义词
     */
    @PostMapping("/wordMeaning/addAntonym")
    public Result<WordMeaningDTO> addWordMeaningAntonym(@RequestBody AntonymDTO synonymDTO) {
        return Result.success(wordService.addAntonym(synonymDTO.getWordId(), synonymDTO.getWordMeaningId(),synonymDTO.getAntonymWordId(),synonymDTO.getAntonymMeaningId()));
    }

    /**
     * 添加词性同义词
     */
    @PostMapping("/wordMeaning/deleteSynonym")
    public Result<Void> removeWordMeaningSynonym(@RequestBody DeleteSynonymDTO synonymDTO) {
        wordService.removeSynonym(synonymDTO.getWordId(),synonymDTO.getMeaningId(),synonymDTO.getSynonymId());
        return Result.success();
    }

    /**
     * 添加词性反义词
     */
    @PostMapping("/wordMeaning/deleteAntonym")
    public Result<WordDTO> removeMeaningAntonym(@RequestBody DeleteAntonymDTO antonymDTO) {
        wordService.removeAntonym(antonymDTO.getWordId(),antonymDTO.getMeaningId(),antonymDTO.getSynonymId());
        return Result.success();
    }

    /**
     * 删除单词
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteWord(@PathVariable String id) {
        wordService.deleteWord(id);
        return Result.success();
    }
    
    /**
     * 获取单词详情
     */
    @GetMapping("/{id}")
    public Result<WordDTO> getWord(@PathVariable String id) {
        return Result.success(wordService.getWord(id));
    }
    
    /**
     * 根据拼写查找单词
     */
    @GetMapping("/spelling/{spelling}")
    public Result<WordDTO> getWordBySpelling(@PathVariable String spelling) {
        return Result.success(wordService.getWordBySpelling(spelling));
    }
    
    /**
     * 根据中文意思模糊查询单词
     */
    @GetMapping("/search")
    public Result<List<WordDTO>> searchWordsByMeaning(@RequestParam String meaning) {
        return Result.success(wordService.searchWordsByMeaning(meaning));
    }
    
    /**
     * 根据词性ID查询单词列表
     */
    @GetMapping("/part-of-speech/{partOfSpeechId}")
    public Result<List<WordDTO>> getWordsByPartOfSpeech(@PathVariable String partOfSpeechId) {
        return Result.success(wordService.getWordsByPartOfSpeech(partOfSpeechId));
    }
    
    /**
     * 获取所有单词
     */
    @GetMapping
    public Result<List<WordDTO>> getAllWords() {
        return Result.success(wordService.getAllWords());
    }
    

}