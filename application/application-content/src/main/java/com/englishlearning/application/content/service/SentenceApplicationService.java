package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.content.mapper.SentenceVariantMapper;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.domain.content.service.SentenceService;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 句子应用服务
 */
@Service
@RequiredArgsConstructor
public class SentenceApplicationService {
    
    private final SentenceService sentenceService;
    private final SentenceMapper sentenceMapper;
    private final SentenceVariantMapper variantMapper;
    private final WordMapper wordMapper;
    
    /**
     * 创建句子
     */
    public SentenceDTO createSentence(SentenceDTO sentenceDTO) {
        return sentenceMapper.toDTO(
            sentenceService.createSentence(
                sentenceMapper.toEntity(sentenceDTO)
            )
        );
    }
    
    /**
     * 更新句子
     */
    public SentenceDTO updateSentence(SentenceDTO sentenceDTO) {
        return sentenceMapper.toDTO(
            sentenceService.updateSentence(
                sentenceMapper.toEntity(sentenceDTO)
            )
        );
    }
    
    /**
     * 查找句子
     */
    public Optional<SentenceDTO> findSentenceById(String id) {
        return sentenceService.findSentenceById(id)
            .map(sentenceMapper::toDTO);
    }
    
    /**
     * 查找所有句子
     */
    public List<SentenceDTO> findAllSentences() {
        return sentenceMapper.toDTOList(sentenceService.findAllSentences());
    }
    
    /**
     * 根据英文内容查找句子
     */
    public List<SentenceDTO> findSentencesByEnglishContent(String englishContent) {
        return sentenceMapper.toDTOList(
            sentenceService.findSentencesByEnglishContent(englishContent)
        );
    }
    
    /**
     * 根据中文意思查找句子
     */
    public List<SentenceDTO> findSentencesByChineseMeaning(String chineseMeaning) {
        return sentenceMapper.toDTOList(
            sentenceService.findSentencesByChineseMeaning(chineseMeaning)
        );
    }
    
    /**
     * 为句子添加变体
     */
    public SentenceDTO addVariant(String sentenceId, SentenceVariantDTO variantDTO) {
        return sentenceMapper.toDTO(
            sentenceService.addVariant(
                sentenceId,
                variantMapper.toEntity(variantDTO)
            )
        );
    }
    
    /**
     * 为句子添加陌生单词
     */
    public SentenceDTO addUnfamiliarWord(String sentenceId, WordDTO wordDTO) {
        return sentenceMapper.toDTO(
            sentenceService.addUnfamiliarWord(
                sentenceId,
                wordMapper.toEntity(wordDTO)
            )
        );
    }
    
    /**
     * 移除句子的陌生单词
     */
    public SentenceDTO removeUnfamiliarWord(String sentenceId, String wordId) {
        return sentenceMapper.toDTO(
            sentenceService.removeUnfamiliarWord(sentenceId, wordId)
        );
    }
    
    /**
     * 分析句子结构
     */
    public String analyzeSentenceGrammar(String sentenceId) {
        return sentenceService.analyzeSentenceGrammar(sentenceId);
    }
    
    /**
     * 删除句子
     */
    public void deleteSentence(String id) {
        sentenceService.deleteSentence(id);
    }
} 