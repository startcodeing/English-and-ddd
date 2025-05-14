package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 句子持久化对象
 */
@Data
@Entity
@Table(name = "t_sentence")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentencePO {
    
    @Id
    private String id;
    
    @Column(name = "english_content", nullable = false, length = 500)
    private String englishContent;
    
    @Column(name = "chinese_meaning", nullable = false, length = 500)
    private String chineseMeaning;
    
    @Column(name = "grammar_analysis", length = 1000)
    private String grammarAnalysis;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "sentence_id")
    private List<SentenceVariantPO> variants = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "t_sentence_unfamiliar_word",
        joinColumns = @JoinColumn(name = "sentence_id"),
        inverseJoinColumns = @JoinColumn(name = "word_id")
    )
    private List<WordPO> unfamiliarWords = new ArrayList<>();
} 