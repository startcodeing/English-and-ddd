package com.englishlearning.domain.vocabulary.model.valueobject;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 常用短语值对象
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommonPhrases {
    
    private List<String> phrases;
    
    /**
     * 创建常用短语
     */
    public static CommonPhrases of(List<String> phrases) {
        if (phrases == null) {
            return new CommonPhrases(new ArrayList<>());
        }
        return new CommonPhrases(new ArrayList<>(phrases));
    }
    
    /**
     * 添加短语
     */
    public CommonPhrases addPhrase(String phrase) {
        if (phrase == null || phrase.trim().isEmpty()) {
            return this;
        }
        
        List<String> newPhrases = new ArrayList<>(this.phrases);
        if (!newPhrases.contains(phrase.trim())) {
            newPhrases.add(phrase.trim());
        }
        return new CommonPhrases(newPhrases);
    }
    
    /**
     * 移除短语
     */
    public CommonPhrases removePhrase(String phrase) {
        if (phrase == null || phrase.trim().isEmpty()) {
            return this;
        }
        
        List<String> newPhrases = new ArrayList<>(this.phrases);
        newPhrases.remove(phrase.trim());
        return new CommonPhrases(newPhrases);
    }
    
    /**
     * 更新短语列表
     */
    public CommonPhrases update(List<String> newPhrases) {
        if (newPhrases == null) {
            return new CommonPhrases(new ArrayList<>());
        }
        return new CommonPhrases(new ArrayList<>(newPhrases));
    }
    
    /**
     * 获取不可变的短语列表
     */
    public List<String> getPhrases() {
        return Collections.unmodifiableList(phrases);
    }
    
    /**
     * 判断是否为空
     */
    public boolean isEmpty() {
        return phrases == null || phrases.isEmpty();
    }
    
    /**
     * 获取短语数量
     */
    public int size() {
        return phrases == null ? 0 : phrases.size();
    }
}