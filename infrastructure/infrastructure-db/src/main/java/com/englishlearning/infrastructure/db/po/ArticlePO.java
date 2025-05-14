package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 文章持久化对象
 */
@Data
@Entity
@Table(name = "t_article")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticlePO {
    
    @Id
    private String id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(length = 100)
    private String source;
    
    @Column(length = 100)
    private String author;
    
    @Column(name = "publish_date")
    private LocalDateTime publishDate;
    
    @Column(name = "difficulty_level")
    private Integer difficultyLevel;
    
    @ManyToMany
    @JoinTable(
        name = "t_article_unfamiliar_word",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "word_id")
    )
    private List<WordPO> unfamiliarWords = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "t_article_sentence",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "sentence_id")
    )
    private List<SentencePO> sentences = new ArrayList<>();
} 