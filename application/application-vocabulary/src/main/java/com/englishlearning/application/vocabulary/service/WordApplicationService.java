package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.WordDTO;

import java.util.List;

/**
 * 单词应用服务接口
 */
public interface WordApplicationService {
    
    /**
     * 创建单词
     */
    WordDTO createWord(WordDTO dto);
    
    /**
     * 更新单词
     */
    WordDTO updateWord(String id, WordDTO dto);
    
    /**
     * 获取单词详情
     */
    WordDTO getWord(String id);
    
    /**
     * 根据拼写查找单词
     */
    WordDTO getWordBySpelling(String spelling);
    
    /**
     * 根据中文意思模糊查询单词
     */
    List<WordDTO> searchWordsByMeaning(String meaning);
    
    /**
     * 根据词性ID查询单词列表
     */
    List<WordDTO> getWordsByPartOfSpeech(String partOfSpeechId);
    
    /**
     * 获取所有单词
     */
    List<WordDTO> getAllWords();
    
    /**
     * 删除单词
     */
    void deleteWord(String id);
}