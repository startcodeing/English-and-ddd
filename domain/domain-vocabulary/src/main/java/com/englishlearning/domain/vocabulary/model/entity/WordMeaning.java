package com.englishlearning.domain.vocabulary.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
     * 单词ID
     */
    private String wordId;
    
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
    private List<String> synonymWordMeaningIds;
    
    /**
     * 反义词列表
     */
    private List<String> antonymWordMeaningIds;
    
    /**
     * 例句ID列表
     */
    private List<String> exampleSentenceIds;
    
    /**
     * 添加同义词
     */
    public void addSynonym(String synonymMeaningId) {
        if (synonymMeaningId == null) {
            return;
        }
        if (this.id.equals(synonymMeaningId)) {
            return;
        }
        
        if (this.synonymWordMeaningIds == null) {
            this.synonymWordMeaningIds = new ArrayList<>();
        }

        if (!this.synonymWordMeaningIds.contains(synonymMeaningId)) {
            this.synonymWordMeaningIds.add(synonymMeaningId);
        }
    }
    
    /**
     * 添加反义词
     */
    public void addAntonym(String antonymMeaingId) {
        if (antonymMeaingId == null) {
            return;
        }
        if (this.id.equals(antonymMeaingId)) {
            return;
        }
        if (this.antonymWordMeaningIds == null) {
            this.antonymWordMeaningIds = new ArrayList<>();
        }
        if (!this.antonymWordMeaningIds.contains(antonymMeaingId)) {
            this.antonymWordMeaningIds.add(antonymMeaingId);
        }
    }
    
    /**
     * 添加例句
     */
    public void addExampleSentence(String sentenceId) {
        if (Objects.isNull(sentenceId)) {
            return;
        }
        
        if (this.exampleSentenceIds == null) {
            this.exampleSentenceIds = new ArrayList<>();
        }
        if (!this.exampleSentenceIds.contains(sentenceId)) {
            this.exampleSentenceIds.add(sentenceId);   
        }
    }
    
    /**
     * 移除例句
     */
    public void removeExampleSentence(String sentenceId) {
        if (Objects.isNull(sentenceId)) {
            return;
        }
        this.exampleSentenceIds.remove(sentenceId);
    }
    
    /**
     * 移除同义词
     */
    public void removeSynonym(String synonymMeaningId) {
        if (Objects.isNull(synonymMeaningId)) {
            return;
        }
    
        this.synonymWordMeaningIds.remove(synonymMeaningId);
    }

    /**
     * 移除反义词
     */
    public void removeAntonym(String antonymId) {
        if (Objects.isNull(antonymId)) {
            return;
        }
        antonymWordMeaningIds.remove(antonymId);
    }
}