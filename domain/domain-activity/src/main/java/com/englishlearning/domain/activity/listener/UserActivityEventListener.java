package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.content.model.entity.Article;
import com.englishlearning.domain.vocabulary.event.*;
import com.englishlearning.domain.content.event.*;
import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * 用户活动事件监听器
 * 基于Spring的事件监听机制，监听系统中的领域事件，记录用户活动
 */
@Component
@Profile("spring-event-handler")
public class UserActivityEventListener {
    
    private final UserActivityService userActivityService;
    
    @Autowired
    public UserActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }
    
    /**
     * 监听单词创建事件
     */
    @EventListener
    public void handleWordCreatedEvent(WordCreatedEvent event) {
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
     * 监听单词更新事件
     */
    @EventListener
    public void handleWordUpdatedEvent(WordUpdatedEvent event) {
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
     * 监听单词删除事件
     */
    @EventListener
    public void handleWordDeletedEvent(WordDeletedEvent event) {
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
     * 监听单词词义添加事件
     */
    @EventListener
    public void handleWordMeaningAddedEvent(WordMeaningAddedEvent event) {
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
     * 监听句子创建事件
     */
    @EventListener
    public void handleSentenceCreatedEvent(SentenceCreatedEvent event) {
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
     * 监听文章创建事件
     */
    @EventListener
    public void handleArticleCreatedEvent(ArticleCreatedEvent event) {
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
     * 监听文章更新事件
     */
    @EventListener
    public void handleArticleUpdatedEvent(ArticleUpdatedEvent event) {
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
     * 监听文章删除事件
     */
    @EventListener
    public void handleArticleDeletedEvent(ArticleDeletedEvent event) {
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
     * 监听文章批量删除事件
     */
    @EventListener
    public void handleArticleBatchDeletedEvent(ArticleBatchDeletedEvent event) {
        String articleTitles = event.getArticles().stream()
            .map(Article::getTitle)
            .collect(Collectors.joining(", "));
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.ARTICLE_BATCH_DELETED,
            "批量删除文章：" + articleTitles,
            String.join(",", event.getArticleIds()),
            "article"
        );
    }
    
    /**
     * 监听句子更新事件
     */
    @EventListener
    public void handleSentenceUpdatedEvent(SentenceUpdatedEvent event) {
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
     * 监听句子删除事件
     */
    @EventListener
    public void handleSentenceDeletedEvent(SentenceDeletedEvent event) {
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
     * 监听句子批量删除事件
     */
    @EventListener
    public void handleSentenceBatchDeletedEvent(SentenceBatchDeletedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.SENTENCE_BATCH_DELETED,
            "批量删除句子，共" + event.getSentenceIds().size() + "条",
            String.join(",", event.getSentenceIds()),
            "sentence"
        );
    }
    
    /**
     * 监听单词批量删除事件
     */
    @EventListener
    public void handleWordBatchDeletedEvent(WordBatchDeletedEvent event) {
        String wordSpellings = event.getWords().stream()
            .map(Word::getSpelling)
            .collect(Collectors.joining(", "));
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BATCH_DELETED,
            "批量删除单词：" + wordSpellings,
            String.join(",", event.getWordIds()),
            "word"
        );
    }
    
    /**
     * 监听单词本创建事件
     */
    @EventListener
    public void handleWordBookCreatedEvent(WordBookCreatedEvent event) {
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
     * 监听单词本更新事件
     */
    @EventListener
    public void handleWordBookUpdatedEvent(WordBookUpdatedEvent event) {
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
     * 监听单词本删除事件
     */
    @EventListener
    public void handleWordBookDeletedEvent(WordBookDeletedEvent event) {
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
     * 监听单词本批量删除事件
     */
    @EventListener
    public void handleWordBookBatchDeletedEvent(WordBookBatchDeletedEvent event) {
        String wordBookNames = event.getWordBooks().stream()
            .map(WordBook::getName)
            .collect(Collectors.joining(", "));
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.WORD_BOOK_BATCH_DELETED,
            "批量删除单词本：" + wordBookNames,
            String.join(",", event.getWordBookIds()),
            "wordbook"
        );
    }
    
    /**
     * 监听词性创建事件
     */
    @EventListener
    public void handlePartOfSpeechCreatedEvent(PartOfSpeechCreatedEvent event) {
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
     * 监听词性更新事件
     */
    @EventListener
    public void handlePartOfSpeechUpdatedEvent(PartOfSpeechUpdatedEvent event) {
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
     * 监听词性删除事件
     */
    @EventListener
    public void handlePartOfSpeechDeletedEvent(PartOfSpeechDeletedEvent event) {
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
     * 监听词性批量删除事件
     */
    @EventListener
    public void handlePartOfSpeechBatchDeletedEvent(PartOfSpeechBatchDeletedEvent event) {
        String posNames = event.getPartOfSpeeches().stream()
            .map(PartOfSpeech::getChineseMeaning)
            .collect(Collectors.joining(", "));
        
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.PART_OF_SPEECH_BATCH_DELETED,
            "批量删除词性：" + posNames,
            String.join(",", event.getPartOfSpeechIds()),
            "partofspeech"
        );
    }
}