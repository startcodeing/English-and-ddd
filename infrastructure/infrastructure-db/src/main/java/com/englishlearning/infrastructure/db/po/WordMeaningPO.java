package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 单词词义持久化对象
 */
@Data
@Entity
@Table(name = "vocabulary_word_meaning")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordMeaningPO {
    
    /**
     * 主键ID
     */
    @Id
    private String id;
    
    /**
     * 单词ID
     */
    @Column(nullable = false)
    private String wordId;
    
    /**
     * 词性ID
     */
    @Column(nullable = false)
    private String partOfSpeechId;
    
    /**
     * 中文意思
     */
    @Column(nullable = false)
    private String chineseMeaning;
    
    /**
     * 例句，以JSON数组形式存储
     */
    @Column(length = 2000)
    private String exampleSentences;
    
    /**
     * 同义词，以JSON数组形式存储
     */
    @Column(length = 1000)
    private String synonymIds;
    
    /**
     * 反义词，以JSON数组形式存储
     */
    @Column(length = 1000)
    private String antonymIds;
    
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