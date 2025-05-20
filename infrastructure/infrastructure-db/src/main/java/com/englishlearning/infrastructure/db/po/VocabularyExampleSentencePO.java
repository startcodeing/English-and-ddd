package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 词汇例句持久化对象
 */
@Data
@Entity
@Table(name = "vocabulary_example_sentence")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyExampleSentencePO {
    
    @Id
    private String id;
    
    @Column(columnDefinition = "TEXT")
    private String sentence;
    
    @Column(columnDefinition = "TEXT")
    private String translation;
    
    @Column(name = "created_at")
    private Long createdAt;
    
    @Column(name = "updated_at")
    private Long updatedAt;
}