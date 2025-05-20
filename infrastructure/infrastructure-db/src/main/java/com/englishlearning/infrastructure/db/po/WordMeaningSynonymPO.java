package com.englishlearning.infrastructure.db.po;

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
    
    @EmbeddedId
    private WordMeaningSynonymId id;
    
    @Column(name = "created_at")
    private Long createdAt;
    
    /**
     * 复合主键类
     */
    @Data
    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WordMeaningSynonymId {
        
        @Column(name = "meaning_id")
        private String meaningId;
        
        @Column(name = "synonym_meaning_id")
        private String synonymMeaningId;
    }
}