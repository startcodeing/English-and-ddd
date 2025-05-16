package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.WordBookDTO;
import com.englishlearning.common.types.Result;

import java.util.List;

/**
 * 单词本应用服务接口
 */
public interface WordBookApplicationService {
    
    /**
     * 创建单词本
     */
    Result<WordBookDTO> createWordBook(WordBookDTO dto);
    
    /**
     * 更新单词本
     */
    Result<WordBookDTO> updateWordBook(String id, WordBookDTO dto);
    
    /**
     * 获取单词本详情
     */
    Result<WordBookDTO> getWordBook(String id);
    
    /**
     * 根据名称查找单词本
     */
    Result<WordBookDTO> getWordBookByName(String name);
    
    /**
     * 获取所有单词本
     */
    Result<List<WordBookDTO>> getAllWordBooks();
    
    /**
     * 删除单词本
     */
    Result<Void> deleteWordBook(String id);
    
    /**
     * 向单词本添加单词
     */
    Result<Void> addWordsToWordBook(String wordBookId, List<String> wordIds);
    
    /**
     * 从单词本移除单词
     */
    Result<Void> removeWordFromWordBook(String wordBookId, String wordId);
    
    /**
     * 获取单词本中的所有单词
     */
    Result<List<WordBookDTO>> getWordsInWordBook(String wordBookId);
}