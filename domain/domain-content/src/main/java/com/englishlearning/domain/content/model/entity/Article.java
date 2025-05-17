package com.englishlearning.domain.content.model.entity;

import com.englishlearning.domain.content.command.CreateArticleCommand;
import com.englishlearning.domain.content.command.UpdateArticleCommand;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 文章实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 全文内容
     */
    private String content;
    
    /**
     * 文章出处
     */
    private String source;
    
    /**
     * 作者
     */
    private String author;
    
    /**
     * 发布日期
     */
    private LocalDateTime publishDate;
    
    /**
     * 难度级别 (1-10)
     */
    private Integer difficultyLevel;
    
    /**
     * 陌生单词列表
     */
    private List<Word> unfamiliarWords;
    
    /**
     * 文章中包含的句子列表
     */
    private List<Sentence> sentences;
    
    /**
     * 创建文章
     * @param command 创建文章命令
     */
    public void create(CreateArticleCommand command) {
        this.title = command.getTitle();
        this.content = command.getContent();
        this.source = command.getSource();
        this.author = command.getAuthor();
        this.publishDate = command.getPublishDate() != null ? command.getPublishDate() : LocalDateTime.now();
        this.difficultyLevel = command.getDifficultyLevel();
        this.unfamiliarWords = new ArrayList<>();
        this.sentences = new ArrayList<>();
    }
    
    /**
     * 更新文章
     * @param command 更新文章命令
     */
    public void update(UpdateArticleCommand command) {
        if (command.getTitle() != null) {
            this.title = command.getTitle();
        }
        if (command.getContent() != null) {
            this.content = command.getContent();
        }
        if (command.getSource() != null) {
            this.source = command.getSource();
        }
        if (command.getAuthor() != null) {
            this.author = command.getAuthor();
        }
        if (command.getPublishDate() != null) {
            this.publishDate = command.getPublishDate();
        }
        if (command.getDifficultyLevel() != null) {
            this.difficultyLevel = command.getDifficultyLevel();
        }
    }
    
    /**
     * 添加句子
     * @param sentence 句子
     */
    public void addSentence(Sentence sentence) {
        if (this.sentences == null) {
            this.sentences = new ArrayList<>();
        }
        
        // 避免重复添加
        boolean exists = this.sentences.stream()
                .anyMatch(s -> s.getId() != null && s.getId().equals(sentence.getId()));
        
        if (!exists) {
            this.sentences.add(sentence);
        }
    }
    
    /**
     * 移除句子
     * @param sentenceId 句子ID
     */
    public void removeSentence(String sentenceId) {
        if (this.sentences != null) {
            this.sentences = this.sentences.stream()
                    .filter(s -> !Objects.equals(s.getId(), sentenceId))
                    .collect(Collectors.toList());
        }
    }
    
    /**
     * 添加陌生单词
     * @param word 单词
     */
    public void addUnfamiliarWord(Word word) {
        if (this.unfamiliarWords == null) {
            this.unfamiliarWords = new ArrayList<>();
        }
        
        // 避免重复添加
        boolean exists = this.unfamiliarWords.stream()
                .anyMatch(w -> w.getId() != null && w.getId().equals(word.getId()));
        
        if (!exists) {
            this.unfamiliarWords.add(word);
        }
    }
    
    /**
     * 移除陌生单词
     * @param wordId 单词ID
     */
    public void removeUnfamiliarWord(String wordId) {
        if (this.unfamiliarWords != null) {
            this.unfamiliarWords = this.unfamiliarWords.stream()
                    .filter(w -> !Objects.equals(w.getId(), wordId))
                    .collect(Collectors.toList());
        }
    }
    
    /**
     * 检查是否包含指定单词
     * @param wordId 单词ID
     * @return 是否包含
     */
    public boolean containsWord(String wordId) {
        if (this.unfamiliarWords == null) {
            return false;
        }
        return this.unfamiliarWords.stream()
                .anyMatch(w -> Objects.equals(w.getId(), wordId));
    }
}
