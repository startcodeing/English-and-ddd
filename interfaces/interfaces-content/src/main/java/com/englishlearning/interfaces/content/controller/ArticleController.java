package com.englishlearning.interfaces.content.controller;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.service.ArticleApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.common.types.Result;
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
    public Result<ArticleDTO> createArticle(@Valid @RequestBody ArticleDTO articleDTO) {
        return Result.success(articleService.createArticle(articleDTO));
    }
    
    /**
     * 更新文章
     */
    @PutMapping("/{id}")
    public Result<ArticleDTO> updateArticle(@PathVariable String id, @Valid @RequestBody ArticleDTO articleDTO) {
        articleDTO.setId(id);
        return Result.success(articleService.updateArticle(articleDTO));
    }
    
    /**
     * 获取文章详情
     */
    @GetMapping("/{id}")
    public Result<ArticleDTO> getArticle(@PathVariable String id) {
        return articleService.findArticleById(id)
            .map(Result::success)
            .orElse(Result.failure("文章不存在"));
    }
    
    /**
     * 获取所有文章
     */
    @GetMapping
    public Result<List<ArticleDTO>> getAllArticles() {
        return Result.success(articleService.findAllArticles());
    }
    
    /**
     * 根据标题查询文章
     */
    @GetMapping("/search/title")
    public Result<List<ArticleDTO>> searchByTitle(@RequestParam String title) {
        return Result.success(articleService.findArticlesByTitle(title));
    }
    
    /**
     * 根据作者查询文章
     */
    @GetMapping("/search/author")
    public Result<List<ArticleDTO>> searchByAuthor(@RequestParam String author) {
        return Result.success(articleService.findArticlesByAuthor(author));
    }
    
    /**
     * 根据出处查询文章
     */
    @GetMapping("/search/source")
    public Result<List<ArticleDTO>> searchBySource(@RequestParam String source) {
        return Result.success(articleService.findArticlesBySource(source));
    }
    
    /**
     * 根据难度级别查询文章
     */
    @GetMapping("/search/difficulty")
    public Result<List<ArticleDTO>> searchByDifficultyLevel(@RequestParam Integer level) {
        return Result.success(articleService.findArticlesByDifficultyLevel(level));
    }
    
    /**
     * 为文章添加句子
     */
    @PostMapping("/{id}/sentences")
    public Result<ArticleDTO> addSentence(@PathVariable String id, @Valid @RequestBody SentenceDTO sentenceDTO) {
        return Result.success(articleService.addSentence(id, sentenceDTO));
    }
    
    /**
     * 从文章中移除句子
     */
    @DeleteMapping("/{id}/sentences/{sentenceId}")
    public Result<ArticleDTO> removeSentence(@PathVariable String id, @PathVariable String sentenceId) {
        return Result.success(articleService.removeSentence(id, sentenceId));
    }
    
    /**
     * 为文章添加陌生单词
     */
    @PostMapping("/{id}/unfamiliar-words")
    public Result<ArticleDTO> addUnfamiliarWord(@PathVariable String id, @Valid @RequestBody WordDTO wordDTO) {
        return Result.success(articleService.addUnfamiliarWord(id, wordDTO));
    }
    
    /**
     * 移除文章的陌生单词
     */
    @DeleteMapping("/{id}/unfamiliar-words/{wordId}")
    public Result<ArticleDTO> removeUnfamiliarWord(@PathVariable String id, @PathVariable String wordId) {
        return Result.success(articleService.removeUnfamiliarWord(id, wordId));
    }
    
    /**
     * 从文章内容中提取句子
     */
    @GetMapping("/{id}/extract-sentences")
    public Result<List<SentenceDTO>> extractSentences(@PathVariable String id) {
        return Result.success(articleService.extractSentences(id));
    }
    
    /**
     * 从文章内容中识别陌生单词
     */
    @PostMapping("/{id}/identify-unfamiliar-words")
    public Result<List<WordDTO>> identifyUnfamiliarWords(
        @PathVariable String id, 
        @RequestBody List<String> knownWordIds) {
        return Result.success(articleService.identifyUnfamiliarWords(id, knownWordIds));
    }
    
    /**
     * 删除文章
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteArticle(@PathVariable String id) {
        articleService.deleteArticle(id);
        return Result.success();
    }
} 