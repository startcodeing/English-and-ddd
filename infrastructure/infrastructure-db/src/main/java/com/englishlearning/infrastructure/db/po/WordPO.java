package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 单词持久化对象
 */
@Data
@Entity
@Table(name = "t_word")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordPO {
    
    @Id
    private String id;
    
    @Column(nullable = false, length = 100)
    private String spelling;
    
    @Column(name = "us_phonetic", length = 50)
    private String usPhonetic;
    
    @Column(name = "uk_phonetic", length = 50)
    private String ukPhonetic;
    
    @Column(length = 500)
    private String definition;
    
    @ManyToOne
    @JoinColumn(name = "part_of_speech_id")
    private PartOfSpeechPO partOfSpeech;
    
    @Column(length = 500)
    private String example;
} 