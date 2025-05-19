package com.englishlearning.domain.vocabulary.model.entity;

import com.englishlearning.domain.vocabulary.command.CreateWordCommand;
import com.englishlearning.domain.vocabulary.command.UpdateWordCommand;
import com.englishlearning.domain.vocabulary.command.WordMeaningCommand;
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
        
        // 处理多个词义
        for (WordMeaningCommand meaningCommand : createCommand.getWordMeanings()) {
            WordMeaning meaning = WordMeaning.builder()
                    .id(UUID.randomUUID().toString())
                    .partOfSpeechId(meaningCommand.getPartOfSpeechId())
                    .chineseMeaning(meaningCommand.getChineseMeaning())
                    .exampleSentences(CollectionUtils.isEmpty(meaningCommand.getExampleSentences()) ?
                            new ArrayList<>() : meaningCommand.getExampleSentences())
                    .synonymIds(CollectionUtils.isEmpty(meaningCommand.getSynonymIds()) ?
                            new ArrayList<>() : meaningCommand.getSynonymIds())
                    .antonymIds(CollectionUtils.isEmpty(meaningCommand.getAntonymIds()) ?
                            new ArrayList<>() : meaningCommand.getAntonymIds())
                    .build();
            
            this.meanings.add(meaning);
        }
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
        
        // 确保词义列表已初始化
        if (this.meanings == null) {
            this.meanings = new ArrayList<>();
        }
        
        // 处理多个词义
        for (WordMeaningCommand meaningCommand : updateCommand.getWordMeanings()) {
            // 查找对应词性的词义（兼容旧版本）
            Optional<WordMeaning> existingMeaning = findMeaningByPartOfSpeech(meaningCommand.getPartOfSpeechId());
            
            if (existingMeaning.isPresent()) {
                // 更新已有词义
                WordMeaning meaning = existingMeaning.get();
                meaning.setChineseMeaning(meaningCommand.getChineseMeaning());
                meaning.updateExampleSentences(meaningCommand.getExampleSentences());
                meaning.updateSynonymIds(meaningCommand.getSynonymIds());
                meaning.updateAntonymIds(meaningCommand.getAntonymIds());
            } else {
                // 创建新词义
                WordMeaning meaning = WordMeaning.builder()
                        .id(UUID.randomUUID().toString())
                        .partOfSpeechId(meaningCommand.getPartOfSpeechId())
                        .chineseMeaning(meaningCommand.getChineseMeaning())
                        .exampleSentences(CollectionUtils.isEmpty(meaningCommand.getExampleSentences()) ?
                                new ArrayList<>() : meaningCommand.getExampleSentences())
                        .synonymIds(CollectionUtils.isEmpty(meaningCommand.getSynonymIds()) ?
                                new ArrayList<>() : meaningCommand.getSynonymIds())
                        .antonymIds(CollectionUtils.isEmpty(meaningCommand.getAntonymIds()) ?
                                new ArrayList<>() : meaningCommand.getAntonymIds())
                        .build();
                
                this.meanings.add(meaning);
            }
        }
    }

    
    /**
     * 添加同义词到指定词义ID的词义中
     */
    public void addSynonym(String wordMeaningId, Word synonym) {
        if (synonym == null || this.getId().equals(synonym.getId())) {
            return;
        }
        
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty()) {
            throw new IllegalArgumentException("词义ID不能为空");
        }
        
        if (this.meanings == null || this.meanings.isEmpty()) {
            throw new IllegalArgumentException("单词没有词义");
        }
        
        // 查找对应ID的词义
        Optional<WordMeaning> meaningOpt = this.meanings.stream()
                .filter(m -> m.getId().equals(wordMeaningId))
                .findFirst();
                
        if (meaningOpt.isPresent()) {
            meaningOpt.get().addSynonym(synonym);
        } else {
            throw new IllegalArgumentException("找不到ID为" + wordMeaningId + "的词义");
        }
    }

    
    /**
     * 添加反义词到指定词义ID的词义中
     */
    public void addAntonym(String wordMeaningId, Word antonym) {
        if (antonym == null || this.getId().equals(antonym.getId())) {
            return;
        }
        
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty()) {
            throw new IllegalArgumentException("词义ID不能为空");
        }
        
        if (this.meanings == null || this.meanings.isEmpty()) {
            throw new IllegalArgumentException("单词没有词义");
        }
        
        // 查找对应ID的词义
        Optional<WordMeaning> meaningOpt = this.meanings.stream()
                .filter(m -> m.getId().equals(wordMeaningId))
                .findFirst();
                
        if (meaningOpt.isPresent()) {
            meaningOpt.get().addAntonym(antonym);
        } else {
            throw new IllegalArgumentException("找不到ID为" + wordMeaningId + "的词义");
        }
    }

    
    /**
     * 添加例句到指定词义ID的词义中
     */
    public void addExampleSentence(String wordMeaningId, String sentence) {
        if (sentence == null || sentence.trim().isEmpty()) {
            return;
        }
        
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty()) {
            throw new IllegalArgumentException("词义ID不能为空");
        }
        
        if (this.meanings == null || this.meanings.isEmpty()) {
            throw new IllegalArgumentException("单词没有词义");
        }
        
        // 查找对应ID的词义
        Optional<WordMeaning> meaningOpt = this.meanings.stream()
                .filter(m -> m.getId().equals(wordMeaningId))
                .findFirst();
                
        if (meaningOpt.isPresent()) {
            meaningOpt.get().addExampleSentence(sentence);
        } else {
            throw new IllegalArgumentException("找不到ID为" + wordMeaningId + "的词义");
        }
    }

    
    /**
     * 移除指定词义ID的词义中的例句
     */
    public void removeExampleSentence(String wordMeaningId, String sentence) {
        if (sentence == null || sentence.trim().isEmpty()) {
            return;
        }
        
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty()) {
            throw new IllegalArgumentException("词义ID不能为空");
        }
        
        if (this.meanings == null || this.meanings.isEmpty()) {
            throw new IllegalArgumentException("单词没有词义");
        }
        
        // 查找对应ID的词义
        Optional<WordMeaning> meaningOpt = this.meanings.stream()
                .filter(m -> m.getId().equals(wordMeaningId))
                .findFirst();
                
        if (meaningOpt.isPresent()) {
            meaningOpt.get().removeExampleSentence(sentence);
        } else {
            throw new IllegalArgumentException("找不到ID为" + wordMeaningId + "的词义");
        }
    }
    

    
    /**
     * 更新指定词义ID的词义的例句列表
     */
    public void updateExampleSentences(String wordMeaningId, List<String> sentences) {
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty()) {
            throw new IllegalArgumentException("词义ID不能为空");
        }
        
        if (this.meanings == null || this.meanings.isEmpty()) {
            throw new IllegalArgumentException("单词没有词义");
        }
        
        // 查找对应ID的词义
        Optional<WordMeaning> meaningOpt = this.meanings.stream()
                .filter(m -> m.getId().equals(wordMeaningId))
                .findFirst();
                
        if (meaningOpt.isPresent()) {
            meaningOpt.get().updateExampleSentences(sentences);
        } else {
            throw new IllegalArgumentException("找不到ID为" + wordMeaningId + "的词义");
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
     * @deprecated 使用findMeaningById(String wordMeaningId)替代
     */
    @Deprecated
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
    public Optional<WordMeaning> findMeaningById(String wordMeaningId) {
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty() || this.meanings == null) {
            return Optional.empty();
        }
        
        return this.meanings.stream()
                .filter(m -> m.getId().equals(wordMeaningId))
                .findFirst();
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
}