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
    WORD_MEANING_ADDED("添加单词词义", "vocabulary"),
    WORD_BOOK_CREATED("创建单词本", "vocabulary"),
    WORD_ADDED_TO_BOOK("添加单词到单词本", "vocabulary"),
    
    // 内容管理相关活动
    SENTENCE_CREATED("创建句子", "content"),
    SENTENCE_UPDATED("更新句子", "content"),
    ARTICLE_CREATED("创建文章", "content"),
    ARTICLE_UPDATED("更新文章", "content"),
    
    // 学习活动
    DICTATION_COMPLETED("完成听写练习", "practice"),
    WRITING_SUBMITTED("提交写作练习", "practice"),
    COMPREHENSIVE_TEST_COMPLETED("完成综合测试", "practice");
    
    private final String description;
    private final String module;
    
    ActivityType(String description, String module) {
        this.description = description;
        this.module = module;
    }

}