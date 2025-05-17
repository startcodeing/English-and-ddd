package com.englishlearning.domain.vocabulary.model.entity;

import com.englishlearning.domain.vocabulary.command.CreateWordCommand;
import com.englishlearning.domain.vocabulary.command.UpdateWordCommand;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    public void create(CreateWordCommand createCommand) {
        createCommand.validate();
        this.spelling = createCommand.getSpelling();
        this.difficultyLevel = createCommand.getDifficultyLevel();
        this.pronunciation = createCommand.getPronunciation();
        
        // 初始化词义列表
        if (this.meanings == null) {
            this.meanings = new ArrayList<>();
        }
        
        // 创建词义
        WordMeaning meaning = WordMeaning.builder()
                .id(UUID.randomUUID().toString())
                .partOfSpeechId(createCommand.getPartOfSpeechId())
                .chineseMeaning(createCommand.getChineseMeaning())
                .exampleSentences(CollectionUtils.isEmpty(createCommand.getExampleSentences()) ?
                        new ArrayList<>() : createCommand.getExampleSentences())
                .synonymIds(CollectionUtils.isEmpty(createCommand.getSynonymIds()) ?
                        new ArrayList<>() : createCommand.getSynonymIds())
                .antonymIds(CollectionUtils.isEmpty(createCommand.getAntonymIds()) ?
                        new ArrayList<>() : createCommand.getAntonymIds())
                .build();
        
        this.meanings.add(meaning);
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
    public void update(UpdateWordCommand updateCommand) {
        updateCommand.validate();
        this.id = updateCommand.getId();
        this.spelling = updateCommand.getSpelling();
        this.difficultyLevel = updateCommand.getDifficultyLevel();
        this.pronunciation = updateCommand.getPronunciation();
        
        // 查找对应词性的词义
        Optional<WordMeaning> existingMeaning = findMeaningByPartOfSpeech(updateCommand.getPartOfSpeechId());
        
        if (existingMeaning.isPresent()) {
            // 更新已有词义
            WordMeaning meaning = existingMeaning.get();
            meaning.setChineseMeaning(updateCommand.getChineseMeaning());
            meaning.updateExampleSentences(updateCommand.getExampleSentences());
            meaning.updateSynonymIds(updateCommand.getSynonymIds());
            meaning.updateAntonymIds(updateCommand.getAntonymIds());
        } else {
            // 创建新词义
            WordMeaning meaning = WordMeaning.builder()
                    .id(UUID.randomUUID().toString())
                    .partOfSpeechId(updateCommand.getPartOfSpeechId())
                    .chineseMeaning(updateCommand.getChineseMeaning())
                    .exampleSentences(CollectionUtils.isEmpty(updateCommand.getExampleSentences()) ?
                            new ArrayList<>() : updateCommand.getExampleSentences())
                    .synonymIds(CollectionUtils.isEmpty(updateCommand.getSynonymIds()) ?
                            new ArrayList<>() : updateCommand.getSynonymIds())
                    .antonymIds(CollectionUtils.isEmpty(updateCommand.getAntonymIds()) ?
                            new ArrayList<>() : updateCommand.getAntonymIds())
                    .build();
            
            if (this.meanings == null) {
                this.meanings = new ArrayList<>();
            }
            
            this.meanings.add(meaning);
        }
    }
    
    /**
     * 添加同义词到指定词性的词义中
     */
    public void addSynonym(String partOfSpeechId, Word synonym) {
        if (synonym == null || this.getId().equals(synonym.getId())) {
            return;
        }
        
        Optional<WordMeaning> meaningOpt = findMeaningByPartOfSpeech(partOfSpeechId);
        if (meaningOpt.isPresent()) {
            meaningOpt.get().addSynonym(synonym);
        } else {
            throw new IllegalArgumentException("找不到词性为" + partOfSpeechId + "的词义");
        }
    }
    
    /**
     * 添加反义词到指定词性的词义中
     */
    public void addAntonym(String partOfSpeechId, Word antonym) {
        if (antonym == null || this.getId().equals(antonym.getId())) {
            return;
        }
        
        Optional<WordMeaning> meaningOpt = findMeaningByPartOfSpeech(partOfSpeechId);
        if (meaningOpt.isPresent()) {
            meaningOpt.get().addAntonym(antonym);
        } else {
            throw new IllegalArgumentException("找不到词性为" + partOfSpeechId + "的词义");
        }
    }
    
    /**
     * 添加例句到指定词性的词义中
     */
    public void addExampleSentence(String partOfSpeechId, String sentence) {
        if (sentence == null || sentence.trim().isEmpty()) {
            return;
        }
        
        Optional<WordMeaning> meaningOpt = findMeaningByPartOfSpeech(partOfSpeechId);
        if (meaningOpt.isPresent()) {
            meaningOpt.get().addExampleSentence(sentence);
        } else {
            throw new IllegalArgumentException("找不到词性为" + partOfSpeechId + "的词义");
        }
    }
    
    /**
     * 移除指定词性词义中的例句
     */
    public void removeExampleSentence(String partOfSpeechId, String sentence) {
        if (sentence == null || sentence.trim().isEmpty()) {
            return;
        }
        
        Optional<WordMeaning> meaningOpt = findMeaningByPartOfSpeech(partOfSpeechId);
        if (meaningOpt.isPresent()) {
            meaningOpt.get().removeExampleSentence(sentence);
        } else {
            throw new IllegalArgumentException("找不到词性为" + partOfSpeechId + "的词义");
        }
    }
    
    /**
     * 更新指定词性词义的例句列表
     */
    public void updateExampleSentences(String partOfSpeechId, List<String> sentences) {
        Optional<WordMeaning> meaningOpt = findMeaningByPartOfSpeech(partOfSpeechId);
        if (meaningOpt.isPresent()) {
            meaningOpt.get().updateExampleSentences(sentences);
        } else {
            throw new IllegalArgumentException("找不到词性为" + partOfSpeechId + "的词义");
        }
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
     * 移除指定词性的词义
     */
    public void removeMeaning(String partOfSpeechId) {
        if (partOfSpeechId == null || partOfSpeechId.trim().isEmpty() || this.meanings == null) {
            return;
        }
        
        this.meanings.removeIf(m -> m.getPartOfSpeechId().equals(partOfSpeechId));
    }
}