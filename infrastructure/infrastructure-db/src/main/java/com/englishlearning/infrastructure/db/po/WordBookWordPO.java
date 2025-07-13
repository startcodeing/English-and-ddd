package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 单词本-单词关联表持久化对象
 */
@Data
@Entity
@Table(name = "word_book_word")
@NoArgsConstructor
@AllArgsConstructor
public class WordBookWordPO implements Serializable {
    
    @EmbeddedId
    private WordBookWordId id;
    
    /**
     * 复合主键类
     */
    @Data
    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WordBookWordId implements Serializable {
        
        @Column(name = "word_book_id")
        private String wordBookId;
        
        @Column(name = "word_id")
        private String wordId;
    }
}