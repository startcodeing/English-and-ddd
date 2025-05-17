package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
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
     * 难度级别（1-5级）
     */
    private Integer difficultyLevel;
    
    /**
     * 单词词义列表
     */
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "word_id")
    private List<WordMeaningPO> meanings = new ArrayList<>();
    
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