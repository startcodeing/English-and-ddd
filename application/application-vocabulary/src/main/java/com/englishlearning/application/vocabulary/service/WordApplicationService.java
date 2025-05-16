package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.common.types.Result;

import java.util.List;

/**
 * 单词应用服务接口
 */
public interface WordApplicationService {
    
    /**
     * 创建单词
     */
    Result<WordDTO> createWord(WordDTO dto);
    
    /**
     * 更新单词
     */
    Result<WordDTO> updateWord(String id, WordDTO dto);
    
    /**
     * 获取单词详情
     */
    Result<WordDTO> getWord(String id);
    
    /**
     * 根据拼写查找单词
     */
    Result<WordDTO> getWordBySpelling(String spelling);
    
    /**
     * 根据中文意思模糊查询单词
     */
    Result<List<WordDTO>> searchWordsByMeaning(String meaning);
    
    /**
     * 根据词性ID查询单词列表
     */
    Result<List<WordDTO>> getWordsByPartOfSpeech(String partOfSpeechId);
    
    /**
     * 获取所有单词
     */
    Result<List<WordDTO>> getAllWords();
    
    /**
     * 删除单词
     */
    Result<Void> deleteWord(String id);
}