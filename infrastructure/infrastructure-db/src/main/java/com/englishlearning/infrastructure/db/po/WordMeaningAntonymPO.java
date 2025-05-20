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
    
    @EmbeddedId
    private WordMeaningAntonymId id;
    
    @Column(name = "created_at")
    private Long createdAt;
    
    /**
     * 复合主键类
     */
    @Data
    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WordMeaningAntonymId {
        
        @Column(name = "meaning_id")
        private String meaningId;
        
        @Column(name = "antonym_meaning_id")
        private String antonymMeaningId;
    }
}