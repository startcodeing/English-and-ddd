package com.englishlearning.infrastructure.db.po;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 单词持久化对象
 */
@Data
@Entity
@Table(name = "vocabulary_word")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordPO {
    
    /**
     * 主键ID
     */
    @Id
    private String id;
    
    /**
     * 单词拼写
     */
    @Column(nullable = false, unique = true)
    private String spelling;
    
    /**
     * 音标
     */
    private String phonetic;
    
    /**
     * 发音URL
     */
    private String pronunciationUrl;
    
    /**
     * 难度级别（1-5级）
     */
    private Integer difficultyLevel;
    
    /**
     * 单词词义列表
     */
    @OneToMany(mappedBy = "word", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<WordMeaningPO> meanings = new ArrayList<>();
    
    /**
     * 获取词义列表的只读视图
     * @return 不可修改的词义列表
     */
    public List<WordMeaningPO> getMeanings() {
        if (meanings == null) {
            return Collections.emptyList();
        }
        return Collections.unmodifiableList(meanings);
    }
    
    /**
     * 添加词义
     * @param meaning 词义对象
     */
    public void addMeaning(WordMeaningPO meaning) {
        meanings.add(meaning);
        meaning.setWord(this);
    }
    
    /**
     * 移除词义
     * @param meaning 词义对象
     */
    public void removeMeaning(WordMeaningPO meaning) {
        meanings.remove(meaning);
        meaning.setWord(null);
    }
    
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