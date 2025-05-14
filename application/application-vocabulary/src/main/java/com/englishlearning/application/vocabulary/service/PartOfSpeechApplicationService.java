package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.common.types.Result;

import java.util.List;

/**
 * 词性应用服务接口
 */
public interface PartOfSpeechApplicationService {
    
    /**
     * 创建词性
     */
    Result<PartOfSpeechDTO> createPartOfSpeech(PartOfSpeechDTO dto);
    
    /**
     * 更新词性
     */
    Result<PartOfSpeechDTO> updatePartOfSpeech(String id, PartOfSpeechDTO dto);
    
    /**
     * 获取词性详情
     */
    Result<PartOfSpeechDTO> getPartOfSpeech(String id);
    
    /**
     * 获取所有词性
     */
    Result<List<PartOfSpeechDTO>> getAllPartOfSpeech();
    
    /**
     * 删除词性
     */
    Result<Void> deletePartOfSpeech(String id);
} 