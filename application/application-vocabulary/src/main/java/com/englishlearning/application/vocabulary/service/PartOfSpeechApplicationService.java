package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;

import com.englishlearning.domain.vocabulary.command.UpdatePartOfSpeechUsageSummaryCommand;
import com.englishlearning.domain.vocabulary.command.UpdatePartOfSpeechCommonPhrasesCommand;

import java.util.List;

/**
 * 词性应用服务接口
 */
public interface PartOfSpeechApplicationService {
    
    /**
     * 创建词性
     */
    PartOfSpeechDTO createPartOfSpeech(PartOfSpeechDTO dto);
    
    /**
     * 更新词性
     */
    PartOfSpeechDTO updatePartOfSpeech(PartOfSpeechDTO dto);
    
    /**
     * 获取词性详情
     */
    PartOfSpeechDTO getPartOfSpeech(String id);
    
    /**
     * 获取所有词性
     */
    List<PartOfSpeechDTO> getAllPartOfSpeech();
    
    /**
     * 删除词性
     */
    void deletePartOfSpeech(String id);
    
    /**
     * 更新词性用法总结
     * @param command 更新词性用法总结命令
     * @return 更新后的词性DTO
     */
    PartOfSpeechDTO updatePartOfSpeechUsageSummary(UpdatePartOfSpeechUsageSummaryCommand command);
    
    /**
     * 更新词性常用短语
     * @param command 更新词性常用短语命令
     * @return 更新后的词性DTO
     */
    PartOfSpeechDTO updatePartOfSpeechCommonPhrases(UpdatePartOfSpeechCommonPhrasesCommand command);
}