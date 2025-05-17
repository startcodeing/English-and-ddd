package com.englishlearning.domain.vocabulary.model.entity;

import com.englishlearning.domain.vocabulary.command.CreateWordBookCommand;
import com.englishlearning.domain.vocabulary.command.UpdateWordBookCommand;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * 单词本实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordBook {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 名称
     */
    private String name;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 单词列表
     */
    private List<Word> words;
    
    /**
     * 创建单词本
     * @param command 创建单词本命令
     */
    public void create(CreateWordBookCommand command) {
        command.validate();
        this.id = UUID.randomUUID().toString();
        this.name = command.getName();
        this.description = command.getDescription();
        this.words = new ArrayList<>();
    }
    
    /**
     * 更新单词本
     * @param command 更新单词本命令
     */
    public void update(UpdateWordBookCommand command) {
        command.validate();
        this.name = command.getName();
        this.description = command.getDescription();
    }
    
    /**
     * 添加单词
     * @param word 单词
     */
    public void addWord(Word word) {
        if (word == null) {
            throw new IllegalArgumentException("单词不能为空");
        }
        
        if (this.words == null) {
            this.words = new ArrayList<>();
        }
        
        // 检查单词是否已存在
        boolean exists = this.words.stream()
                .anyMatch(w -> Objects.equals(w.getId(), word.getId()));
        
        if (!exists) {
            this.words.add(word);
        }
    }
    
    /**
     * 移除单词
     * @param wordId 单词ID
     */
    public void removeWord(String wordId) {
        if (wordId == null || wordId.trim().isEmpty()) {
            throw new IllegalArgumentException("单词ID不能为空");
        }
        
        if (this.words == null) {
            return;
        }
        
        this.words.removeIf(word -> Objects.equals(word.getId(), wordId));
    }
    
    /**
     * 判断单词是否在单词本中
     * @param wordId 单词ID
     * @return 是否存在
     */
    public boolean containsWord(String wordId) {
        if (wordId == null || wordId.trim().isEmpty() || this.words == null) {
            return false;
        }
        
        return this.words.stream()
                .anyMatch(word -> Objects.equals(word.getId(), wordId));
    }
}