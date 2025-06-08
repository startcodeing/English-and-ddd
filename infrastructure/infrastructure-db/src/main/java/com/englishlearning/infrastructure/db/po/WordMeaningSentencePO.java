package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 词义-例句关联持久化对象
 */
@Data
@Entity
@Table(name = "word_meaning_sentence")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordMeaningSentencePO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "meaning_id")
    private WordMeaningPO wordMeaning;

    @Column(name = "sentence_id")
    private String sentenceId;

    @Column(name = "created_at")
    private Long createdAt;
}