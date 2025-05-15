package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

/**
 * 单词持久化对象
 */
@Data
@Entity
@Table(name = "vocabulary_word")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordPO {
    
    /**
     * 主键ID
     */
    @Id
    private String id;
    
    /**
     * 单词拼写
     */
    @Column(nullable = false, unique = true)
    private String spelling;
    
    /**
     * 音标
     */
    private String phonetic;
    
    /**
     * 发音URL
     */
    private String pronunciationUrl;
    
    /**
     * 中文意思
     */
    @Column(nullable = false)
    private String chineseMeaning;
    
    /**
     * 英文释义
     */
    private String englishDefinition;
    
    /**
     * 例句，以JSON数组形式存储
     */
    @Column(length = 2000)
    private String exampleSentences;
    
    /**
     * 词性ID
     */
    private String partOfSpeechId;
    
    /**
     * 难度级别（1-5级）
     */
    private Integer difficultyLevel;
    
    /**
     * 相关单词，以JSON数组形式存储
     */
    @Column(length = 1000)
    private String relatedWords;
    
    /**
     * 创建时间
     */
    @Column(name = "created_at")
    private Long createdAt;
    
    /**
     * 更新时间
     */
    @Column(name = "updated_at")
    private Long updatedAt;
} 