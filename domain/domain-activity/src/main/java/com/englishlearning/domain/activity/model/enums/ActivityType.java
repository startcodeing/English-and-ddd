package com.englishlearning.domain.activity.model.enums;

import lombok.Getter;

/**
 * 活动类型枚举
 * 定义系统中的各种用户活动类型
 */
@Getter
public enum ActivityType {
    
    // 词汇管理相关活动
    WORD_CREATED("创建单词", "vocabulary"),
    WORD_UPDATED("更新单词", "vocabulary"),
    WORD_DELETED("删除单词", "vocabulary"),
    WORD_BATCH_DELETED("批量删除单词", "vocabulary"),
    WORD_MEANING_ADDED("添加单词词义", "vocabulary"),
    WORD_BOOK_CREATED("创建单词本", "vocabulary"),
    WORD_BOOK_UPDATED("更新单词本", "vocabulary"),
    WORD_BOOK_DELETED("删除单词本", "vocabulary"),
    WORD_BOOK_BATCH_DELETED("批量删除单词本", "vocabulary"),
    WORD_ADDED_TO_BOOK("添加单词到单词本", "vocabulary"),
    PART_OF_SPEECH_CREATED("创建词性", "vocabulary"),
    PART_OF_SPEECH_UPDATED("更新词性", "vocabulary"),
    PART_OF_SPEECH_DELETED("删除词性", "vocabulary"),
    PART_OF_SPEECH_BATCH_DELETED("批量删除词性", "vocabulary"),
    
    // 内容管理相关活动
    SENTENCE_CREATED("创建句子", "content"),
    SENTENCE_UPDATED("更新句子", "content"),
    SENTENCE_DELETED("删除句子", "content"),
    SENTENCE_BATCH_DELETED("批量删除句子", "content"),
    ARTICLE_CREATED("创建文章", "content"),
    ARTICLE_UPDATED("更新文章", "content"),
    ARTICLE_DELETED("删除文章", "content"),
    ARTICLE_BATCH_DELETED("批量删除文章", "content"),
    LISTENING_MATERIAL_CREATED("创建听力资料", "content"),
    LISTENING_MATERIAL_UPDATED("更新听力资料", "content"),
    LISTENING_MATERIAL_DELETED("删除听力资料", "content"),
    LISTENING_MATERIAL_BATCH_DELETED("批量删除听力资料", "content"),
    GRAMMAR_ANALYSIS_CREATED("创建语法分析", "content"),
    GRAMMAR_ANALYSIS_UPDATED("更新语法分析", "content"),
    GRAMMAR_ANALYSIS_DELETED("删除语法分析", "content"),
    GRAMMAR_ANALYSIS_BATCH_DELETED("批量删除语法分析", "content"),
    
    // 学习活动
    DICTATION_COMPLETED("完成听写练习", "practice"),
    WRITING_SUBMITTED("提交写作练习", "practice"),
    COMPREHENSIVE_TEST_COMPLETED("完成综合测试", "practice"),
    WORD_PRACTICE_COMPLETED("完成单词练习", "practice"),
    ARTICLE_READING_COMPLETED("完成文章阅读", "practice"),
    LISTENING_PRACTICE_COMPLETED("完成听力练习", "practice"),
    WORD_REVIEW_COMPLETED("完成单词复习", "practice"),
    SENTENCE_TRANSLATION_COMPLETED("完成句子翻译", "practice");
    
    private final String description;
    private final String module;
    
    ActivityType(String description, String module) {
        this.description = description;
        this.module = module;
    }

}