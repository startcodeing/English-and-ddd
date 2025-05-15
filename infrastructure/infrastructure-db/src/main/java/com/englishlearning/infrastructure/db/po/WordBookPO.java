package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 单词本持久化对象
 */
@Data
@Entity
@Table(name = "word_book")
@NoArgsConstructor
@AllArgsConstructor
public class WordBookPO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description")
    private String description;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "word_book_word",
        joinColumns = @JoinColumn(name = "word_book_id"),
        inverseJoinColumns = @JoinColumn(name = "word_id")
    )
    private List<WordPO> words = new ArrayList<>();
}