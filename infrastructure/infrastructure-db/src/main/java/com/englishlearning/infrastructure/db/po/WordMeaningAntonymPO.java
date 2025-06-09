package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 词义-反义词关联持久化对象
 */
@Data
@Entity
@Table(name = "word_meaning_antonym")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordMeaningAntonymPO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "created_at")
    private Long createdAt;

    @ManyToOne
    @JoinColumn(name = "meaning_id")
    private WordMeaningPO wordMeaning;

    @Column(name = "antonym_word_id")
    private String antonymWordId;

    @Column(name = "antonym_meaning_id")
    private String antonymMeaningId;
}