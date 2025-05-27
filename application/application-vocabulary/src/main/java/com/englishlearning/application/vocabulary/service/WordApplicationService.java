package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.AddWordMeaningExampleSentenceDTO;
import com.englishlearning.application.vocabulary.dto.DeleteWordMeaningSentenceDTO;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.dto.WordMeaningDTO;

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
    WordDTO updateWord(WordDTO dto);

    /**
     * 添加词性
     */
    WordDTO addWordMeaning(WordMeaningDTO dto);

    /**
     * 删除词性
     */
    WordDTO removeWordMeaning(String wordId,String meaningId);

    /**
     * 添加词性例句
     */
    WordDTO addExampleSentence(AddWordMeaningExampleSentenceDTO addSentenceDto);

    /**
     * 添加词性同义词
     */
    WordMeaningDTO addSynonym(String wordId, String wordMeaningId, String synonymWordId,String synonymWordMeaningId);

    /**
     * 添加词性反义词
     */
    WordMeaningDTO addAntonym(String wordId, String wordMeaningId,String antonymWordId,String antonymMeaningId);

    /**
     * 删除词性同义词
     */
    void removeSynonym(String wordId,String meaningId, String synonymId);

    /**
     * 删除词性反义词
     */
    void removeAntonym(String wordId,String meaningId, String synonymId);
    
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

    /**
     * 删除词性例句
     */
    WordMeaningDTO removeExampleSentence(DeleteWordMeaningSentenceDTO deleteWordMeaningSentenceDTO);
}