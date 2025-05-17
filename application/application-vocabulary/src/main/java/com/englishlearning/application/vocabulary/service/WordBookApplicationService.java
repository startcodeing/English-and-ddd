package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.WordBookDTO;

import java.util.List;

/**
 * 单词本应用服务接口
 */
public interface WordBookApplicationService {
    
    /**
     * 创建单词本
     */
    WordBookDTO createWordBook(WordBookDTO dto);
    
    /**
     * 更新单词本
     */
    WordBookDTO updateWordBook(String id, WordBookDTO dto);
    
    /**
     * 获取单词本详情
     */
    WordBookDTO getWordBook(String id);
    
    /**
     * 根据名称查找单词本
     */
    WordBookDTO getWordBookByName(String name);
    
    /**
     * 获取所有单词本
     */
    List<WordBookDTO> getAllWordBooks();
    
    /**
     * 删除单词本
     */
    void deleteWordBook(String id);
    
    /**
     * 向单词本添加单词
     */
    void addWordsToWordBook(String wordBookId, List<String> wordIds);
    
    /**
     * 从单词本移除单词
     */
    void removeWordFromWordBook(String wordBookId, String wordId);
    
    /**
     * 获取单词本中的所有单词
     */
    List<WordBookDTO> getWordsInWordBook(String wordBookId);
}