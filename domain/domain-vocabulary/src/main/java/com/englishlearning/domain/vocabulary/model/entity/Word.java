package com.englishlearning.domain.vocabulary.model.entity;

import com.englishlearning.domain.vocabulary.command.CreateWordCommand;
import com.englishlearning.domain.vocabulary.command.UpdateWordCommand;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * 单词实体
 * 聚合根，包含多个词义（不同词性下的含义）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Word {
    
    /**
     * ID
     */
    private String id;

    /**
     * 难度级别（1-5级）
     */
    private Integer difficultyLevel;
    
    /**
     * 拼写
     */
    private String spelling;

    /**
     * 发音
     */
    private String pronunciation;
    
    /**
     * 词义列表（不同词性下的含义、同义词、反义词和例句）
     */
    private List<WordMeaning> meanings;

    /**
     * 创建新的单词
     */
    public void createWordBasic(CreateWordCommand createCommand) {
        createCommand.validate();
        this.spelling = createCommand.getSpelling();
        this.difficultyLevel = createCommand.getDifficultyLevel();
        this.pronunciation = createCommand.getPronunciation();
    }
    
    /**
     * 使用现有ID创建单词（用于从存储中重建实体）
     */
    public static Word reconstitute(String id, Integer difficultyLevel, String spelling,
                                   String pronunciation, List<WordMeaning> meanings) {
        return new Word(
                id,
                difficultyLevel,
                spelling,
                pronunciation,
                meanings != null ? new ArrayList<>(meanings) : new ArrayList<>()
        );
    }
    
    /**
     * 更新单词信息
     */
    public void updateWordBasic(UpdateWordCommand updateCommand) {
        updateCommand.validate();
        this.id = updateCommand.getId();
        this.spelling = updateCommand.getSpelling();
        this.difficultyLevel = updateCommand.getDifficultyLevel();
        this.pronunciation = updateCommand.getPronunciation();
    }

    /**
     * 添加新的词义
     */
    public void addMeaning(WordMeaning meaning) {
        if (meaning == null) {
            return;
        }
        if (this.meanings == null) {
            this.meanings = new ArrayList<>();
        }
        
        // 检查是否已存在相同词性的词义
        boolean exists = this.meanings.stream()
                .anyMatch(m -> m.getPartOfSpeechId().equals(meaning.getPartOfSpeechId()));
        
        if (!exists) {
            this.meanings.add(meaning);
        } else {
            throw new IllegalArgumentException("已存在词性为" + meaning.getPartOfSpeechId() + "的词义");
        }
    }


    /**
     * 移除指定ID的词义
     */
    public void removeMeaning(String wordMeaningId) {
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty() || this.meanings == null) {
            return;
        }
        
        this.meanings.removeIf(m -> m.getId().equals(wordMeaningId));
    }

    
    /**
     * 添加同义词到指定词义ID的词义中
     */
    public void addSynonym(String wordMeaningId,String synonymMeaningId) {
        this.assertMeaningExists(wordMeaningId);
        
        WordMeaning targetWordMeaning = this.findMeaningByMeaningId(wordMeaningId).get();
                
        if (!Objects.isNull(targetWordMeaning)) {
            targetWordMeaning.addSynonym(synonymMeaningId);
        }
    }

    
    /**
     * 添加反义词到指定词义ID的词义中
     */
    public void addAntonym(String wordMeaningId, String antonymMeaningId) {
      
        this.assertMeaningExists(wordMeaningId);
        
        WordMeaning targetWordMeaning = this.findMeaningByMeaningId(wordMeaningId).get();
                
        if (!Objects.isNull(targetWordMeaning)) {
            targetWordMeaning.addAntonym(antonymMeaningId);
        }
    }

    
    /**
     * 添加例句到指定词义ID的词义中
     */
    public void addExampleSentence(String wordMeaningId, String sentenceId) {
       
        this.assertMeaningExists(wordMeaningId);
        
        WordMeaning targetWordMeaning = this.findMeaningByMeaningId(wordMeaningId).get();
                
        if (!Objects.isNull(targetWordMeaning)) {
            targetWordMeaning.addExampleSentence(sentenceId);
        }
    }

    
    public void removeSynonym(String meaningId, String synonymId) {
        Optional<WordMeaning> target = findMeaningByMeaningId(meaningId);
        if (target.isPresent()) {
            target.get().removeSynonym(synonymId);
        }
    }

    public void removeAntonym(String meaningId, String antonymId) {
        Optional<WordMeaning> target = findMeaningByMeaningId(meaningId);
        if (target.isPresent()) {
            target.get().removeAntonym(antonymId);
        }
    }

    public void removeExampleSentence(String meaningId, String sentenceId) {
        Optional<WordMeaning> target = findMeaningByMeaningId(meaningId);
        if (target.isPresent()) {
            target.get().removeExampleSentence(sentenceId);
        }
    }

    
    /**
     * 根据词性查找词义
     */
    public Optional<WordMeaning> findMeaningByPartOfSpeech(String partOfSpeechId) {
        if (partOfSpeechId == null || partOfSpeechId.trim().isEmpty() || this.meanings == null) {
            return Optional.empty();
        }
        
        return this.meanings.stream()
                .filter(m -> m.getPartOfSpeechId().equals(partOfSpeechId))
                .findFirst();
    }
    
    /**
     * 根据词义ID查找词义
     */
    public Optional<WordMeaning> findMeaningByMeaningId(String wordMeaningId) {
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty() || this.meanings == null) {
            return Optional.empty();
        }
        
        return this.meanings.stream()
                .filter(m -> m.getId().equals(wordMeaningId))
                .findFirst();
    }

    private void assertMeaningExists(String meaningId) {
        if (!findMeaningByMeaningId(meaningId).isPresent()) {
            throw new IllegalArgumentException("WordMeaning not found: " + meaningId);
        }
    }
}