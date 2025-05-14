package com.englishlearning.interfaces.content.controller;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.service.ArticleApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.common.response.CommonResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 文章管理接口
 */
@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
public class ArticleController {
    
    private final ArticleApplicationService articleService;
    
    /**
     * 创建文章
     */
    @PostMapping
    public CommonResult<ArticleDTO> createArticle(@Valid @RequestBody ArticleDTO articleDTO) {
        return CommonResult.success(articleService.createArticle(articleDTO));
    }
    
    /**
     * 更新文章
     */
    @PutMapping("/{id}")
    public CommonResult<ArticleDTO> updateArticle(@PathVariable String id, @Valid @RequestBody ArticleDTO articleDTO) {
        articleDTO.setId(id);
        return CommonResult.success(articleService.updateArticle(articleDTO));
    }
    
    /**
     * 获取文章详情
     */
    @GetMapping("/{id}")
    public CommonResult<ArticleDTO> getArticle(@PathVariable String id) {
        return articleService.findArticleById(id)
            .map(CommonResult::success)
            .orElse(CommonResult.failed("文章不存在"));
    }
    
    /**
     * 获取所有文章
     */
    @GetMapping
    public CommonResult<List<ArticleDTO>> getAllArticles() {
        return CommonResult.success(articleService.findAllArticles());
    }
    
    /**
     * 根据标题查询文章
     */
    @GetMapping("/search/title")
    public CommonResult<List<ArticleDTO>> searchByTitle(@RequestParam String title) {
        return CommonResult.success(articleService.findArticlesByTitle(title));
    }
    
    /**
     * 根据作者查询文章
     */
    @GetMapping("/search/author")
    public CommonResult<List<ArticleDTO>> searchByAuthor(@RequestParam String author) {
        return CommonResult.success(articleService.findArticlesByAuthor(author));
    }
    
    /**
     * 根据出处查询文章
     */
    @GetMapping("/search/source")
    public CommonResult<List<ArticleDTO>> searchBySource(@RequestParam String source) {
        return CommonResult.success(articleService.findArticlesBySource(source));
    }
    
    /**
     * 根据难度级别查询文章
     */
    @GetMapping("/search/difficulty")
    public CommonResult<List<ArticleDTO>> searchByDifficultyLevel(@RequestParam Integer level) {
        return CommonResult.success(articleService.findArticlesByDifficultyLevel(level));
    }
    
    /**
     * 为文章添加句子
     */
    @PostMapping("/{id}/sentences")
    public CommonResult<ArticleDTO> addSentence(@PathVariable String id, @Valid @RequestBody SentenceDTO sentenceDTO) {
        return CommonResult.success(articleService.addSentence(id, sentenceDTO));
    }
    
    /**
     * 从文章中移除句子
     */
    @DeleteMapping("/{id}/sentences/{sentenceId}")
    public CommonResult<ArticleDTO> removeSentence(@PathVariable String id, @PathVariable String sentenceId) {
        return CommonResult.success(articleService.removeSentence(id, sentenceId));
    }
    
    /**
     * 为文章添加陌生单词
     */
    @PostMapping("/{id}/unfamiliar-words")
    public CommonResult<ArticleDTO> addUnfamiliarWord(@PathVariable String id, @Valid @RequestBody WordDTO wordDTO) {
        return CommonResult.success(articleService.addUnfamiliarWord(id, wordDTO));
    }
    
    /**
     * 移除文章的陌生单词
     */
    @DeleteMapping("/{id}/unfamiliar-words/{wordId}")
    public CommonResult<ArticleDTO> removeUnfamiliarWord(@PathVariable String id, @PathVariable String wordId) {
        return CommonResult.success(articleService.removeUnfamiliarWord(id, wordId));
    }
    
    /**
     * 从文章内容中提取句子
     */
    @GetMapping("/{id}/extract-sentences")
    public CommonResult<List<SentenceDTO>> extractSentences(@PathVariable String id) {
        return CommonResult.success(articleService.extractSentences(id));
    }
    
    /**
     * 从文章内容中识别陌生单词
     */
    @PostMapping("/{id}/identify-unfamiliar-words")
    public CommonResult<List<WordDTO>> identifyUnfamiliarWords(
        @PathVariable String id, 
        @RequestBody List<String> knownWordIds) {
        return CommonResult.success(articleService.identifyUnfamiliarWords(id, knownWordIds));
    }
    
    /**
     * 删除文章
     */
    @DeleteMapping("/{id}")
    public CommonResult<Void> deleteArticle(@PathVariable String id) {
        articleService.deleteArticle(id);
        return CommonResult.success(null);
    }
} 