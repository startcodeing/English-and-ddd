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

    @Column(name = "meaning_id")
    private String meaningId;

    @Column(name = "sentence_id")
    private String sentenceId;

    @Column(name = "created_at")
    private Long createdAt;
}