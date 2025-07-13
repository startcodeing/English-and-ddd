package com.englishlearning.infrastructure.activity.handler;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.content.event.*;
import com.englishlearning.domain.vocabulary.event.*;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.config.ProcessingGroup;
import org.axonframework.eventhandling.EventHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * 基于Axon Framework的用户活动事件处理器
 * 使用Axon的@EventHandler注解处理领域事件
 */
@Slf4j
@Component
@ProcessingGroup("userActivityEventHandler")
@Profile("axon-event-handler")
public class AxonUserActivityEventHandler {
    
    private final UserActivityService userActivityService;
    
    @Autowired
    public AxonUserActivityEventHandler(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }
    
    /**
     * 处理单词创建事件
     */
    @EventHandler
    public void handle(WordCreatedEvent event) {
        log.info("Axon handling WordCreatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_CREATED,
            "创建单词：" + event.getWord().getSpelling(),
            event.getWord().getId(),
            "word"
        );
    }
    
    /**
     * 处理单词更新事件
     */
    @EventHandler
    public void handle(WordUpdatedEvent event) {
        log.info("Axon handling WordUpdatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_UPDATED,
            "更新单词：" + event.getWord().getSpelling(),
            event.getWord().getId(),
            "word"
        );
    }
    
    /**
     * 处理单词删除事件
     */
    @EventHandler
    public void handle(WordDeletedEvent event) {
        log.info("Axon handling WordDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_DELETED,
            "删除单词：" + event.getWord().getSpelling(),
            event.getWord().getId(),
            "word"
        );
    }
    
    /**
     * 处理单词批量删除事件
     */
    @EventHandler
    public void handle(WordBatchDeletedEvent event) {
        log.info("Axon handling WordBatchDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BATCH_DELETED,
            "批量删除单词：" + event.getWords().size() + "个",
            null,
            "word"
        );
    }
    
    /**
     * 处理单词词义添加事件
     */
    @EventHandler
    public void handle(WordMeaningAddedEvent event) {
        log.info("Axon handling WordMeaningAddedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_MEANING_ADDED,
            "添加词义：" + event.getWord().getSpelling(),
            event.getWord().getId(),
            "word"
        );
    }
    
    /**
     * 处理词性创建事件
     */
    @EventHandler
    public void handle(PartOfSpeechCreatedEvent event) {
        log.info("Axon handling PartOfSpeechCreatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_CREATED,
            "创建词性：" + event.getPartOfSpeech().getChineseMeaning(),
            event.getPartOfSpeech().getId(),
            "partofspeech"
        );
    }
    
    /**
     * 处理词性更新事件
     */
    @EventHandler
    public void handle(PartOfSpeechUpdatedEvent event) {
        log.info("Axon handling PartOfSpeechUpdatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_UPDATED,
            "更新词性：" + event.getPartOfSpeech().getChineseMeaning(),
            event.getPartOfSpeech().getId(),
            "partofspeech"
        );
    }
    
    /**
     * 处理词性删除事件
     */
    @EventHandler
    public void handle(PartOfSpeechDeletedEvent event) {
        log.info("Axon handling PartOfSpeechDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_DELETED,
            "删除词性：" + event.getPartOfSpeech().getChineseMeaning(),
            event.getPartOfSpeech().getId(),
            "partofspeech"
        );
    }
    
    /**
     * 处理词性批量删除事件
     */
    @EventHandler
    public void handle(PartOfSpeechBatchDeletedEvent event) {
        log.info("Axon handling PartOfSpeechBatchDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_BATCH_DELETED,
            "批量删除词性：" + event.getPartOfSpeeches().size() + "个",
            null,
            "partofspeech"
        );
    }
    
    // 单词本相关事件处理
    
    /**
     * 处理单词本创建事件
     */
    @EventHandler
    public void handle(WordBookCreatedEvent event) {
        log.info("Axon handling WordBookCreatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_CREATED,
            "创建单词本：" + event.getWordBook().getName(),
            event.getWordBook().getId(),
            "wordbook"
        );
    }
    
    /**
     * 处理单词本更新事件
     */
    @EventHandler
    public void handle(WordBookUpdatedEvent event) {
        log.info("Axon handling WordBookUpdatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_UPDATED,
            "更新单词本：" + event.getWordBook().getName(),
            event.getWordBook().getId(),
            "wordbook"
        );
    }
    
    /**
     * 处理单词本删除事件
     */
    @EventHandler
    public void handle(WordBookDeletedEvent event) {
        log.info("Axon handling WordBookDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_DELETED,
            "删除单词本：" + event.getWordBook().getName(),
            event.getWordBook().getId(),
            "wordbook"
        );
    }
    
    /**
     * 处理单词本批量删除事件
     */
    @EventHandler
    public void handle(WordBookBatchDeletedEvent event) {
        log.info("Axon handling WordBookBatchDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_BATCH_DELETED,
            "批量删除单词本：" + event.getWordBooks().size() + "个",
            null,
            "wordbook"
        );
    }
    
    // 内容相关事件处理
    
    /**
     * 处理文章创建事件
     */
    @EventHandler
    public void handle(ArticleCreatedEvent event) {
        log.info("Axon handling ArticleCreatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_CREATED,
            "创建文章：" + event.getArticle().getTitle(),
            event.getArticle().getId(),
            "article"
        );
    }
    
    /**
     * 处理文章更新事件
     */
    @EventHandler
    public void handle(ArticleUpdatedEvent event) {
        log.info("Axon handling ArticleUpdatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_UPDATED,
            "更新文章：" + event.getArticle().getTitle(),
            event.getArticle().getId(),
            "article"
        );
    }
    
    /**
     * 处理文章删除事件
     */
    @EventHandler
    public void handle(ArticleDeletedEvent event) {
        log.info("Axon handling ArticleDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_DELETED,
            "删除文章：" + event.getArticle().getTitle(),
            event.getArticle().getId(),
            "article"
        );
    }
    
    /**
     * 处理文章批量删除事件
     */
    @EventHandler
    public void handle(ArticleBatchDeletedEvent event) {
        log.info("Axon handling ArticleBatchDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_BATCH_DELETED,
            "批量删除文章：" + event.getArticles().size() + "个",
            null,
            "article"
        );
    }
    
    /**
     * 处理句子创建事件
     */
    @EventHandler
    public void handle(SentenceCreatedEvent event) {
        log.info("Axon handling SentenceCreatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_CREATED,
            "创建句子",
            event.getSentence().getId(),
            "sentence"
        );
    }
    
    /**
     * 处理句子更新事件
     */
    @EventHandler
    public void handle(SentenceUpdatedEvent event) {
        log.info("Axon handling SentenceUpdatedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_UPDATED,
            "更新句子",
            event.getSentence().getId(),
            "sentence"
        );
    }
    
    /**
     * 处理句子删除事件
     */
    @EventHandler
    public void handle(SentenceDeletedEvent event) {
        log.info("Axon handling SentenceDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_DELETED,
            "删除句子",
            event.getSentence().getId(),
            "sentence"
        );
    }
    
    /**
     * 处理句子批量删除事件
     */
    @EventHandler
    public void handle(SentenceBatchDeletedEvent event) {
        log.info("Axon handling SentenceBatchDeletedEvent: {}", event);
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_BATCH_DELETED,
            "批量删除句子：" + event.getSentences().size() + "个",
            null,
            "sentence"
        );
    }
}