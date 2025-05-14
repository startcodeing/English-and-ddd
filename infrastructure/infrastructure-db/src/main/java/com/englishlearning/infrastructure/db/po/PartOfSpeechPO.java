package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

/**
 * 词性持久化对象
 */
@Data
@Entity
@Table(name = "part_of_speech")
@NoArgsConstructor
@AllArgsConstructor
public class PartOfSpeechPO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "english_name", nullable = false, unique = true)
    private String englishName;
    
    @Column(name = "chinese_meaning", nullable = false)
    private String chineseMeaning;
    
    @Column(name = "usage_summary")
    private String usageSummary;
    
    @ElementCollection
    @CollectionTable(name = "part_of_speech_phrases", joinColumns = @JoinColumn(name = "part_of_speech_id"))
    @Column(name = "phrase")
    private List<String> commonPhrases;
} 