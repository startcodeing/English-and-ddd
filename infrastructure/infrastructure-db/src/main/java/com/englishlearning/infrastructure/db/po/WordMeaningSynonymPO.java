package com.englishlearning.infrastructure.db.po;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 词义-同义词关联持久化对象
 */
@Data
@Entity
@Table(name = "word_meaning_synonym")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordMeaningSynonymPO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "meaning_id")
    @JsonIgnore
    private WordMeaningPO wordMeaning;

    @Column(name = "synonym_word_id")
    private String synonymWordId;

    @Column(name = "synonym_meaning_id")
    private String synonymMeaningId;

    @Column(name = "created_at")
    private Long createdAt;

}