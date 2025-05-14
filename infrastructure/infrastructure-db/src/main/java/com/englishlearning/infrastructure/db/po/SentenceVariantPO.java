package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 句子变体持久化对象
 */
@Data
@Entity
@Table(name = "t_sentence_variant")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentenceVariantPO {
    
    @Id
    private String id;
    
    @Column(nullable = false, length = 500)
    private String content;
    
    @Column(nullable = false, length = 50)
    private String type;
    
    @Column(length = 500)
    private String description;
}
 