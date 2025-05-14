package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.ArticleDTO;
import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.mapper.ArticleMapper;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.domain.content.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 文章应用服务
 */
@Service
@RequiredArgsConstructor
public class ArticleApplicationService {
    
    private final ArticleService articleService;
    private final ArticleMapper articleMapper;
    private final SentenceMapper sentenceMapper;
    private final WordMapper wordMapper;
    
    /**
     * 创建文章
     */
    public ArticleDTO createArticle(ArticleDTO articleDTO) {
        return articleMapper.toDTO(
            articleService.createArticle(
                articleMapper.toEntity(articleDTO)
            )
        );
    }
    
    /**
     * 更新文章
     */
    public ArticleDTO updateArticle(ArticleDTO articleDTO) {
        return articleMapper.toDTO(
            articleService.updateArticle(
                articleMapper.toEntity(articleDTO)
            )
        );
    }
    
    /**
     * 查找文章
     */
    public Optional<ArticleDTO> findArticleById(String id) {
        return articleService.findArticleById(id)
            .map(articleMapper::toDTO);
    }
    
    /**
     * 查找所有文章
     */
    public List<ArticleDTO> findAllArticles() {
        return articleMapper.toDTOList(articleService.findAllArticles());
    }
    
    /**
     * 根据标题查找文章
     */
    public List<ArticleDTO> findArticlesByTitle(String title) {
        return articleMapper.toDTOList(
            articleService.findArticlesByTitle(title)
        );
    }
    
    /**
     * 根据作者查找文章
     */
    public List<ArticleDTO> findArticlesByAuthor(String author) {
        return articleMapper.toDTOList(
            articleService.findArticlesByAuthor(author)
        );
    }
    
    /**
     * 根据出处查找文章
     */
    public List<ArticleDTO> findArticlesBySource(String source) {
        return articleMapper.toDTOList(
            articleService.findArticlesBySource(source)
        );
    }
    
    /**
     * 根据难度级别查找文章
     */
    public List<ArticleDTO> findArticlesByDifficultyLevel(Integer difficultyLevel) {
        return articleMapper.toDTOList(
            articleService.findArticlesByDifficultyLevel(difficultyLevel)
        );
    }
    
    /**
     * 为文章添加句子
     */
    public ArticleDTO addSentence(String articleId, SentenceDTO sentenceDTO) {
        return articleMapper.toDTO(
            articleService.addSentence(
                articleId,
                sentenceMapper.toEntity(sentenceDTO)
            )
        );
    }
    
    /**
     * 从文章中移除句子
     */
    public ArticleDTO removeSentence(String articleId, String sentenceId) {
        return articleMapper.toDTO(
            articleService.removeSentence(articleId, sentenceId)
        );
    }
    
    /**
     * 为文章添加陌生单词
     */
    public ArticleDTO addUnfamiliarWord(String articleId, WordDTO wordDTO) {
        return articleMapper.toDTO(
            articleService.addUnfamiliarWord(
                articleId,
                wordMapper.toEntity(wordDTO)
            )
        );
    }
    
    /**
     * 移除文章的陌生单词
     */
    public ArticleDTO removeUnfamiliarWord(String articleId, String wordId) {
        return articleMapper.toDTO(
            articleService.removeUnfamiliarWord(articleId, wordId)
        );
    }
    
    /**
     * 从文章内容中提取句子
     */
    public List<SentenceDTO> extractSentences(String articleId) {
        return sentenceMapper.toDTOList(
            articleService.extractSentences(articleId)
        );
    }
    
    /**
     * 从文章内容中识别陌生单词
     */
    public List<WordDTO> identifyUnfamiliarWords(String articleId, List<String> knownWordIds) {
        return wordMapper.toDTOList(
            articleService.identifyUnfamiliarWords(articleId, knownWordIds)
        );
    }
    
    /**
     * 删除文章
     */
    public void deleteArticle(String id) {
        articleService.deleteArticle(id);
    }
} 