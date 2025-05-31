package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.content.mapper.SentenceVariantMapper;
import com.englishlearning.application.content.service.SentenceApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.application.vocabulary.mapper.WordMapper;
import com.englishlearning.domain.content.command.CreateSentenceDomainDTO;
import com.englishlearning.domain.content.command.UpdateSentenceCommand;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.model.entity.SentenceVariant;
import com.englishlearning.domain.content.repository.SentenceRepository;
import com.englishlearning.domain.content.service.SentenceService;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 句子应用服务实现类
 * 直接使用领域服务与领域层交互
 */
@Service
@RequiredArgsConstructor
public class SentenceApplicationServiceImpl implements SentenceApplicationService {
    
    private final SentenceRepository sentenceRepository;
    private final SentenceService sentenceService;
    private final WordRepository wordRepository;
    private final SentenceMapper sentenceMapper;
    private final SentenceVariantMapper variantMapper;
    private final WordMapper wordMapper;
    
    /**
     * 创建句子
     */
    @Transactional
    @Override
    public SentenceDTO createSentence(SentenceDTO sentenceDTO) {
        CreateSentenceDomainDTO command = CreateSentenceDomainDTO.builder()
                .englishContent(sentenceDTO.getEnglishContent())
                .chineseMeaning(sentenceDTO.getChineseMeaning())
                .grammarAnalysis(sentenceDTO.getGrammarAnalysis())
                .build();

        Sentence sentence = Sentence.builder()
                .id(UUID.randomUUID().toString())
                .build();
        sentence.create(command);
        Sentence savedSentence = sentenceRepository.save(sentence);
        return sentenceMapper.toDTO(savedSentence);
    }
    
    /**
     * 更新句子
     */
    @Transactional
    @Override
    public SentenceDTO updateSentence(SentenceDTO sentenceDTO) {
        UpdateSentenceCommand command = UpdateSentenceCommand.builder()
                .id(sentenceDTO.getId())
                .englishContent(sentenceDTO.getEnglishContent())
                .chineseMeaning(sentenceDTO.getChineseMeaning())
                .grammarAnalysis(sentenceDTO.getGrammarAnalysis())
                .build();

        Sentence sentence = sentenceRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + command.getId()));
        sentence.update(command);
        Sentence updatedSentence = sentenceService.updateSentence(sentence);
        return sentenceMapper.toDTO(updatedSentence);
    }
    
    /**
     * 查找句子
     */
    @Override
    public Optional<SentenceDTO> findSentenceById(String id) {
        return sentenceRepository.findById(id)
                .map(sentenceMapper::toDTO);
    }
    
    /**
     * 查找所有句子
     */
    @Override
    public List<SentenceDTO> findAllSentences() {
        return sentenceRepository.findAll().stream()
                .map(sentenceMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据英文内容查找句子
     */
    @Override
    public List<SentenceDTO> findSentencesByEnglishContent(String englishContent) {
        return sentenceRepository.findByEnglishContentLike(englishContent).stream()
                .map(sentenceMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据中文意思查找句子
     */
    @Override
    public List<SentenceDTO> findSentencesByChineseMeaning(String chineseMeaning) {
        return sentenceRepository.findByChineseMeaningLike(chineseMeaning).stream()
                .map(sentenceMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 为句子添加变体
     */
    @Transactional
    @Override
    public SentenceDTO addVariant(String sentenceId, SentenceVariantDTO variantDTO) {
        SentenceVariant variant = SentenceVariant.builder()
                .type(variantDTO.getType())
                .content(variantDTO.getContent())
                .build();

        Sentence updatedSentence = sentenceService.addVariant(sentenceId, variant);
        return sentenceMapper.toDTO(updatedSentence);
    }
    
    /**
     * 为句子添加陌生单词
     */
    @Transactional
    @Override
    public SentenceDTO addUnfamiliarWord(String sentenceId, WordDTO wordDTO) {
        Word word = wordRepository.findById(wordDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordDTO.getId()));
        Sentence updatedSentence = sentenceService.addUnfamiliarWord(sentenceId, word);
        return sentenceMapper.toDTO(updatedSentence);
    }
    
    /**
     * 删除句子
     */
    @Transactional
    @Override
    public void deleteSentence(String id) {
        sentenceService.deleteSentence(id);
    }
}