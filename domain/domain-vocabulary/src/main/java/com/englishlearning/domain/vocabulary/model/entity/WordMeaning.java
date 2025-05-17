package com.englishlearning.domain.vocabulary.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 单词词义实体
 * 作为Word聚合根的子实体，表示单词在特定词性下的含义、同义词、反义词和例句
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordMeaning {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 词性ID
     */
    private String partOfSpeechId;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 同义词列表
     */
    private List<String> synonymIds;
    
    /**
     * 反义词列表
     */
    private List<String> antonymIds;
    
    /**
     * 例句列表
     */
    private List<String> exampleSentences;
    
    /**
     * 添加同义词
     */
    public void addSynonym(Word synonym) {
        if (synonym == null) {
            return;
        }
        
        if (this.synonymIds == null) {
            this.synonymIds = new ArrayList<>();
        }
        
        boolean exists = this.synonymIds.stream()
                .anyMatch(s -> s.equals(synonym.getId()));
        
        if (!exists) {
            this.synonymIds.add(synonym.getId());
        }
    }
    
    /**
     * 添加反义词
     */
    public void addAntonym(Word antonym) {
        if (antonym == null) {
            return;
        }
        
        if (this.antonymIds == null) {
            this.antonymIds = new ArrayList<>();
        }
        
        boolean exists = this.antonymIds.stream()
                .anyMatch(id -> id.equals(antonym.getId()));
        
        if (!exists) {
            this.antonymIds.add(antonym.getId());
        }
    }
    
    /**
     * 添加例句
     */
    public void addExampleSentence(String sentence) {
        if (sentence == null || sentence.trim().isEmpty()) {
            return;
        }
        
        if (this.exampleSentences == null) {
            this.exampleSentences = new ArrayList<>();
        }
        
        if (!this.exampleSentences.contains(sentence)) {
            this.exampleSentences.add(sentence);
        }
    }
    
    /**
     * 移除例句
     */
    public void removeExampleSentence(String sentence) {
        if (sentence == null || sentence.trim().isEmpty() || this.exampleSentences == null) {
            return;
        }
        
        this.exampleSentences.remove(sentence);
    }
    
    /**
     * 更新例句列表
     */
    public void updateExampleSentences(List<String> sentences) {
        this.exampleSentences = sentences != null ? new ArrayList<>(sentences) : new ArrayList<>();
    }
    
    /**
     * 更新同义词列表
     */
    public void updateSynonymIds(List<String> synonymIds) {
        this.synonymIds = synonymIds != null ? new ArrayList<>(synonymIds) : new ArrayList<>();
    }
    
    /**
     * 更新反义词列表
     */
    public void updateAntonymIds(List<String> antonymIds) {
        this.antonymIds = antonymIds != null ? new ArrayList<>(antonymIds) : new ArrayList<>();
    }
}