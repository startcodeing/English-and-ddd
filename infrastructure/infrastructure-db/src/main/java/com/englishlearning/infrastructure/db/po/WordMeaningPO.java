package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

/**
 * 单词词义持久化对象
 */
@Data
@Entity
@Table(name = "vocabulary_word_meaning")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WordMeaningPO {
    
    /**
     * 主键ID
     */
    @Id
    private String id;
    
    /**
     * 单词ID
     */
    @ManyToOne
    @JoinColumn(name = "word_id")
    private WordPO word;
    
    /**
     * 词性ID
     */
    @Column(nullable = false)
    private String partOfSpeechId;
    
    /**
     * 中文意思
     */
    @Column(nullable = false)
    private String chineseMeaning;
    
    /**
     * 例句关联，通过关联表实现
     */
    @OneToMany(mappedBy = "wordMeaning", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WordMeaningSentencePO> exampleSentences;
    
    /**
     * 同义词关联，通过关联表实现
     */
    @OneToMany(mappedBy = "wordMeaning",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WordMeaningSynonymPO> synonyms;
    
    /**
     * 反义词关联，通过关联表实现
     */
    @OneToMany(mappedBy = "wordMeaning",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WordMeaningAntonymPO> antonyms;
    
    /**
     * 创建时间
     */
    @Column(name = "created_at")
    private Long createdAt;
    
    /**
     * 更新时间
     */
    @Column(name = "updated_at")
    private Long updatedAt;
}