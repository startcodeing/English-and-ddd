package com.englishlearning.domain.vocabulary.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    private String phonetic;
    
    /**
     * 词义列表（不同词性下的含义、同义词、反义词和例句）
     */
    private List<WordMeaning> meanings;

    
    /**
     * 创建新的单词
     */
    public void createWord(Word word) {
        this.spelling = word.getSpelling();
        this.difficultyLevel = word.getDifficultyLevel();
        this.phonetic = word.getPhonetic();
    }
    
    /**
     * 更新单词信息
     */
    public void updateWord(Word word) {
        this.id = word.getId();
        this.spelling = word.getSpelling();
        this.difficultyLevel = word.getDifficultyLevel();
        this.phonetic = word.getPhonetic();
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
     * 添加新的词义
     */
    public void updateMeaning(WordMeaning meaning) {
        if (meaning == null) {
            return;
        }
        if (this.meanings == null) {
            this.meanings = new ArrayList<>();
        }
        boolean existMeaning = this.meanings.stream().anyMatch(m -> m.getId().equals(meaning.getId()));
        if (!existMeaning) {
            throw new IllegalArgumentException("词义" + meaning.getId() + "不存在");
        }
        boolean exists = this.meanings.stream()
                .anyMatch(m -> m.getPartOfSpeechId().equals(meaning.getPartOfSpeechId()) && !m.getId().equals(meaning.getId()) );
        if (exists) {
            throw new IllegalArgumentException("存在词性为" + meaning.getPartOfSpeechId() + "的词义");
        }
        List<WordMeaning> currentMeaningList = new ArrayList<>(this.meanings.stream().filter(m -> !m.getId().equals(meaning.getId())).toList());
        currentMeaningList.add(meaning);
        this.meanings = currentMeaningList;
    }


    /**
     * 移除指定ID的词义
     */
    public void removeMeaning(String wordMeaningId) {
        if (wordMeaningId == null || wordMeaningId.trim().isEmpty() || this.meanings == null) {
            return;
        }
        
        // 在删除词义之前，先清理该词义的所有关联关系
        Optional<WordMeaning> meaningToRemove = this.findMeaningByMeaningId(wordMeaningId);
        if (meaningToRemove.isPresent()) {
            WordMeaning meaning = meaningToRemove.get();
            
            // 清理该词义的所有同义词关联
            if (meaning.getSynonymWordMeaningIds() != null) {
                meaning.getSynonymWordMeaningIds().clear();
            }
            
            // 清理该词义的所有反义词关联
            if (meaning.getAntonymWordMeaningIds() != null) {
                meaning.getAntonymWordMeaningIds().clear();
            }
            
            // 清理其他词义中对该词义的同义词引用
            this.meanings.forEach(otherMeaning -> {
                if (otherMeaning.getSynonymWordMeaningIds() != null) {
                    otherMeaning.getSynonymWordMeaningIds().remove(wordMeaningId);
                }
                if (otherMeaning.getAntonymWordMeaningIds() != null) {
                    otherMeaning.getAntonymWordMeaningIds().remove(wordMeaningId);
                }
            });
        }
        
        // 最后删除词义本身
        this.meanings.removeIf(m -> m.getId().equals(wordMeaningId));
    }

    
    /**
     * 添加同义词到指定词义ID的词义中
     */
    public void addSynonym(String wordMeaningId,String synonymMeaningId) {
        this.assertMeaningExists(wordMeaningId);
        
        Optional<WordMeaning> targetWordMeaning = this.findMeaningByMeaningId(wordMeaningId);
        targetWordMeaning.ifPresent(wordMeaning -> wordMeaning.addSynonym(synonymMeaningId));
    }

    
    /**
     * 添加反义词到指定词义ID的词义中
     */
    public void addAntonym(String wordMeaningId, String antonymMeaningId) {
        this.assertMeaningExists(wordMeaningId);
        Optional<WordMeaning> targetWordMeaning = this.findMeaningByMeaningId(wordMeaningId);
        targetWordMeaning.ifPresent(wordMeaning -> {wordMeaning.addAntonym(antonymMeaningId);});
    }

    
    /**
     * 添加例句到指定词义ID的词义中
     */
    public void addExampleSentence(String wordMeaningId, String sentenceId) {
        this.assertMeaningExists(wordMeaningId);
        
        Optional<WordMeaning> targetWordMeaning = this.findMeaningByMeaningId(wordMeaningId);
        targetWordMeaning.ifPresent(wordMeaning -> wordMeaning.addExampleSentence(sentenceId));
    }

    /**
     * 删除指定词性的同义词
     */
    public void removeSynonym(String meaningId, String synonymId) {
        Optional<WordMeaning> target = findMeaningByMeaningId(meaningId);
        target.ifPresent(wordMeaning -> wordMeaning.removeSynonym(synonymId));
    }


    /**
     * 删除指定词性的反义词
     */
    public void removeAntonym(String meaningId, String antonymId) {
        Optional<WordMeaning> target = findMeaningByMeaningId(meaningId);
        target.ifPresent(wordMeaning -> wordMeaning.removeAntonym(antonymId));
    }

    /**
     * 删除指定词性的例句
     */
    public void removeExampleSentence(String meaningId, String sentenceId) {
        Optional<WordMeaning> target = findMeaningByMeaningId(meaningId);
        target.ifPresent(wordMeaning -> wordMeaning.removeExampleSentence(sentenceId));
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
        if (findMeaningByMeaningId(meaningId).isEmpty()) {
            throw new IllegalArgumentException("WordMeaning not found: " + meaningId);
        }
    }
}