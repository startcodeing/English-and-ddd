package com.englishlearning.domain.content.command;

import com.englishlearning.domain.content.event.ArticleCreatedEvent;
import com.englishlearning.domain.content.event.ArticleEventPublisher;
import com.englishlearning.domain.content.event.ArticleUpdatedEvent;
import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.repository.ArticleRepository;
import com.englishlearning.domain.content.repository.SentenceRepository;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 文章命令处理器实现类
 */
@Service
@RequiredArgsConstructor
public class ArticleCommandHandlerImpl implements ArticleCommandHandler {
    
    private final ArticleRepository articleRepository;
    private final SentenceRepository sentenceRepository;
    private final WordRepository wordRepository;
    private final ArticleEventPublisher eventPublisher;
    
    @Override
    public Article handle(CreateArticleCommand command) {
        command.validate();
        
        Article article = Article.builder().build();
        article.create(command);
        
        Article savedArticle = articleRepository.save(article);
        
        // 发布文章创建事件
        int sentenceCount = (savedArticle.getSentences() != null) ? savedArticle.getSentences().size() : 0;
        eventPublisher.publishArticleCreatedEvent(new ArticleCreatedEvent(
            savedArticle.getId(),
            savedArticle.getTitle(),
            savedArticle.getDifficultyLevel(),
            sentenceCount
        ));
        return savedArticle;
    }
    
    @Override
    public Article handle(UpdateArticleCommand command) {
        command.validate();
        
        // 获取实体
        Article article = articleRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + command.getId()));
        
        // 执行更新逻辑
        article.update(command);
        
        // 保存并返回
        Article updatedArticle = articleRepository.save(article);
        
        // 发布文章更新事件
        eventPublisher.publishArticleUpdatedEvent(new ArticleUpdatedEvent(
            updatedArticle.getId(),
            updatedArticle.getTitle(),
            updatedArticle.getContent(),
            updatedArticle.getDifficultyLevel()
        ));
        
        return updatedArticle;
    }
    
    @Override
    public void handle(DeleteArticleCommand command) {
        command.validate();
        
        // 检查文章是否存在
        articleRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + command.getId()));
        
        // 删除文章
        articleRepository.deleteById(command.getId());
    }
    
    @Override
    public Article addSentenceToArticle(String articleId, String sentenceId) {
        if (articleId == null || articleId.trim().isEmpty()) {
            throw new IllegalArgumentException("文章ID不能为空");
        }
        if (sentenceId == null || sentenceId.trim().isEmpty()) {
            throw new IllegalArgumentException("句子ID不能为空");
        }
        
        // 获取文章
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        // 获取句子
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        // 添加句子到文章
        article.addSentence(sentence);
        
        // 保存并返回
        return articleRepository.save(article);
    }
    
    @Override
    public Article removeSentenceFromArticle(String articleId, String sentenceId) {
        if (articleId == null || articleId.trim().isEmpty()) {
            throw new IllegalArgumentException("文章ID不能为空");
        }
        if (sentenceId == null || sentenceId.trim().isEmpty()) {
            throw new IllegalArgumentException("句子ID不能为空");
        }
        
        // 获取文章
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        // 移除句子
        article.removeSentence(sentenceId);
        
        // 保存并返回
        return articleRepository.save(article);
    }
    
    @Override
    public Article addWordToArticle(String articleId, String wordId) {
        if (articleId == null || articleId.trim().isEmpty()) {
            throw new IllegalArgumentException("文章ID不能为空");
        }
        if (wordId == null || wordId.trim().isEmpty()) {
            throw new IllegalArgumentException("单词ID不能为空");
        }
        
        // 获取文章
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        // 获取单词
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        
        // 添加单词到文章
        article.addUnfamiliarWord(word);
        
        // 保存并返回
        return articleRepository.save(article);
    }
    
    @Override
    public Article removeWordFromArticle(String articleId, String wordId) {
        if (articleId == null || articleId.trim().isEmpty()) {
            throw new IllegalArgumentException("文章ID不能为空");
        }
        if (wordId == null || wordId.trim().isEmpty()) {
            throw new IllegalArgumentException("单词ID不能为空");
        }
        
        // 获取文章
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("文章不存在: " + articleId));
        
        // 检查单词是否存在
        if (!article.containsWord(wordId)) {
            throw new IllegalArgumentException("文章中不存在该单词: " + wordId);
        }
        
        // 移除单词
        article.removeUnfamiliarWord(wordId);
        
        // 保存并返回
        return articleRepository.save(article);
    }
}