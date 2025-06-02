package com.englishlearning.domain.content.model.entity;

import com.englishlearning.domain.content.dto.CreateSentenceDomainDTO;
import com.englishlearning.domain.content.dto.UpdateSentenceDTO;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 句子实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sentence {
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 英文内容
     */
    private String englishContent;
    
    /**
     * 中文意思
     */
    private String chineseMeaning;
    
    /**
     * 文章ID
     */
    private String articleId;
    
    /**
     * 语法分析
     */
    private String grammarAnalysis;
    
    /**
     * 变体表示方式列表
     */
    private List<SentenceVariant> variants;
    
    /**
     * 陌生单词列表
     */
    private List<String> unfamiliarWords;
    
    /**
     * 创建句子
     * @param command 创建句子命令
     */
    public void create(CreateSentenceDomainDTO command) {
        this.englishContent = command.getEnglishContent();
        this.chineseMeaning = command.getChineseMeaning();
        this.grammarAnalysis = command.getGrammarAnalysis();
        this.variants = new ArrayList<>();
        this.unfamiliarWords = new ArrayList<>();
    }
    
    /**
     * 更新句子
     * @param command 更新句子命令
     */
    public void update(UpdateSentenceDTO command) {
        this.id = command.getId();
        this.englishContent = command.getEnglishContent();
        this.chineseMeaning = command.getChineseMeaning();
        this.grammarAnalysis = command.getGrammarAnalysis();
    }
    
    /**
     * 添加变体
     * @param variant 句子变体
     */
    public void addVariant(SentenceVariant variant) {
        if (this.variants == null) {
            this.variants = new ArrayList<>();
        }
        
        // 避免重复添加
        boolean exists = this.variants.stream()
                .anyMatch(v -> v.getId() != null && v.getId().equals(variant.getId()));
        
        if (!exists) {
            this.variants.add(variant);
        }
    }
    
    /**
     * 移除变体
     * @param variantId 变体ID
     */
    public void removeVariant(String variantId) {
        if (this.variants != null) {
            this.variants = this.variants.stream()
                    .filter(v -> !Objects.equals(v.getId(), variantId))
                    .collect(Collectors.toList());
        }
    }
    
    /**
     * 添加陌生单词
     * @param wordId 单词
     */
    public void addUnfamiliarWord(String wordId) {
        if (this.unfamiliarWords == null) {
            this.unfamiliarWords = new ArrayList<>();
        }
        // 避免重复添加
        boolean exists = this.unfamiliarWords.stream()
                .anyMatch(w -> w.equals(wordId));
        
        if (!exists) {
            this.unfamiliarWords.add(wordId);
        }
    }
    
    /**
     * 移除陌生单词
     * @param wordId 单词ID
     */
    public void removeUnfamiliarWord(String wordId) {
        if (this.unfamiliarWords != null) {
            this.unfamiliarWords = this.unfamiliarWords.stream()
                    .filter(w -> !Objects.equals(w, wordId))
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
                .anyMatch(w -> Objects.equals(w, wordId));
    }
}