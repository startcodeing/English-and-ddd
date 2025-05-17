package com.englishlearning.domain.vocabulary.model.entity;

import com.englishlearning.domain.vocabulary.command.CreateWordCommand;
import com.englishlearning.domain.vocabulary.command.UpdateWordCommand;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 单词实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Component
public class Word {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 拼写
     */
    private String spelling;
    
    /**
     * 词性
     */
    private PartOfSpeech partOfSpeech;
    
    /**
     * 发音
     */
    private String pronunciation;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 同义词列表
     */
    private List<Word> synonyms;
    
    /**
     * 反义词列表
     */
    private List<Word> antonyms;
    
    /**
     * 例句列表
     */
    private List<String> exampleSentences;
    
    /**
     * 创建新的单词
     */
    public void create(CreateWordCommand createCommand) {
        createCommand.validate();
        this.spelling = createCommand.getSpelling();
        this.pronunciation = createCommand.getPronunciation();
        this.chineseMeaning = createCommand.getChineseMeaning();
        this.exampleSentences = createCommand.getExampleSentences() != null ? 
                new ArrayList<>(createCommand.getExampleSentences()) : new ArrayList<>();
        this.synonyms = new ArrayList<>();
        this.antonyms = new ArrayList<>();
    }
    
    /**
     * 使用现有ID创建单词（用于从存储中重建实体）
     */
    public static Word reconstitute(String id, String spelling, PartOfSpeech partOfSpeech,
                                   String pronunciation, String chineseMeaning,
                                   List<Word> synonyms, List<Word> antonyms, List<String> exampleSentences) {
        return new Word(
                id,
                spelling,
                partOfSpeech,
                pronunciation,
                chineseMeaning,
                synonyms != null ? new ArrayList<>(synonyms) : new ArrayList<>(),
                antonyms != null ? new ArrayList<>(antonyms) : new ArrayList<>(),
                exampleSentences != null ? new ArrayList<>(exampleSentences) : new ArrayList<>()
        );
    }
    
    /**
     * 更新单词信息
     */
    public void update(UpdateWordCommand updateCommand) {
        updateCommand.validate();
        this.id = updateCommand.getId();
        this.spelling = updateCommand.getSpelling();
        this.pronunciation = updateCommand.getPronunciation();
        this.chineseMeaning = updateCommand.getChineseMeaning();
        this.exampleSentences = updateCommand.getExampleSentences() != null ? 
                new ArrayList<>(updateCommand.getExampleSentences()) : new ArrayList<>();
    }
    
    /**
     * 添加同义词
     */
    public void addSynonym(Word synonym) {
        if (synonym == null || this.getId().equals(synonym.getId())) {
            return;
        }
        
        if (this.synonyms == null) {
            this.synonyms = new ArrayList<>();
        }
        
        boolean exists = this.synonyms.stream()
                .anyMatch(s -> s.getId().equals(synonym.getId()));
        
        if (!exists) {
            this.synonyms.add(synonym);
        }
    }
    
    /**
     * 添加反义词
     */
    public void addAntonym(Word antonym) {
        if (antonym == null || this.getId().equals(antonym.getId())) {
            return;
        }
        
        if (this.antonyms == null) {
            this.antonyms = new ArrayList<>();
        }
        
        boolean exists = this.antonyms.stream()
                .anyMatch(a -> a.getId().equals(antonym.getId()));
        
        if (!exists) {
            this.antonyms.add(antonym);
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
}