package com.englishlearning.domain.content.model.entity;

import com.englishlearning.domain.vocabulary.model.entity.Word;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 全文内容
     */
    private String content;
    
    /**
     * 文章出处
     */
    private String source;
    
    /**
     * 作者
     */
    private String author;
    
    /**
     * 发布日期
     */
    private LocalDateTime publishDate;
    
    /**
     * 难度级别 (1-10)
     */
    private Integer difficultyLevel;
    
    /**
     * 陌生单词列表
     */
    private List<Word> unfamiliarWords;
    
    /**
     * 文章中包含的句子列表
     */
    private List<Sentence> sentences;
} 