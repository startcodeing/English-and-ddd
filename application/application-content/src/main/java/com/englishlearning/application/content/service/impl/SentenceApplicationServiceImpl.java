package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.content.service.SentenceApplicationService;
import com.englishlearning.domain.content.dto.CreateSentenceDomainDTO;
import com.englishlearning.domain.content.dto.UpdateSentenceDTO;
import com.englishlearning.domain.content.event.SentenceCreatedEvent;
import com.englishlearning.domain.content.event.SentenceDeletedEvent;
import com.englishlearning.domain.content.event.SentenceEventPublisher;
import com.englishlearning.domain.content.event.SentenceUpdatedEvent;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.model.entity.SentenceVariant;
import com.englishlearning.domain.content.repository.SentenceRepository;
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
    private final WordRepository wordRepository;
    private final SentenceMapper sentenceMapper;
    private final SentenceEventPublisher sentenceEventPublisher;

    /**
     * 创建句子
     */
    @Transactional
    @Override
    public SentenceDTO createSentence(SentenceDTO sentenceDTO) {
        CreateSentenceDomainDTO sentenceInfo = CreateSentenceDomainDTO.builder()
                .englishContent(sentenceDTO.getEnglishContent())
                .chineseMeaning(sentenceDTO.getChineseMeaning())
                .grammarAnalysis(sentenceDTO.getGrammarAnalysis())
                .build();

        Sentence newSentence = Sentence.builder()
                .id(UUID.randomUUID().toString())
                .build();
        newSentence.create(sentenceInfo);
        Sentence savedSentence = sentenceRepository.save(newSentence);
        
        // 发布句子创建事件
        SentenceCreatedEvent event = new SentenceCreatedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setSentence(savedSentence);
        sentenceEventPublisher.publishSentenceCreatedEvent(event);
        
        return sentenceMapper.toDTO(savedSentence);
    }
    
    /**
     * 更新句子
     */
    @Transactional
    @Override
    public SentenceDTO updateSentence(SentenceDTO sentenceDTO) {
        UpdateSentenceDTO updateInfo = UpdateSentenceDTO.builder()
                .id(sentenceDTO.getId())
                .englishContent(sentenceDTO.getEnglishContent())
                .chineseMeaning(sentenceDTO.getChineseMeaning())
                .grammarAnalysis(sentenceDTO.getGrammarAnalysis())
                .build();

        Sentence sentence = sentenceRepository.findById(updateInfo.getId())
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + updateInfo.getId()));

        sentence.update(updateInfo);
        Sentence savedSentence = sentenceRepository.save(sentence);
        
        // 发布句子更新事件
        SentenceUpdatedEvent event = new SentenceUpdatedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setSentence(savedSentence);
        sentenceEventPublisher.publishSentenceUpdatedEvent(event);
        
        return sentenceMapper.toDTO(savedSentence);
    }

    /**
     * 为句子添加变体
     */
    @Transactional
    @Override
    public SentenceDTO addVariant(String sentenceId, SentenceVariantDTO variantDTO) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));

        SentenceVariant variant = SentenceVariant.builder()
                .type(variantDTO.getType())
                .content(variantDTO.getContent())
                .build();

        sentence.addVariant(variant);
        Sentence saveSentence = sentenceRepository.save(sentence);
        return sentenceMapper.toDTO(saveSentence);
    }


    @Override
    public SentenceDTO removeVariant(String sentenceId, String variantId) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        sentence.removeVariant(variantId);
        Sentence saveSentence = sentenceRepository.save(sentence);
        return sentenceMapper.toDTO(saveSentence);
    }

    /**
     * 为句子添加陌生单词
     */
    @Transactional
    @Override
    public SentenceDTO addUnfamiliarWord(String sentenceId, String wordId) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        sentence.addUnfamiliarWord(wordId);
        Sentence saveSentence = sentenceRepository.save(sentence);
        return sentenceMapper.toDTO(saveSentence);
    }


    @Override
    public SentenceDTO removeUnfamiliarWord(String sentenceId, String wordId) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordId));
        sentence.removeUnfamiliarWord(wordId);
        Sentence saveSentence = sentenceRepository.save(sentence);
        return sentenceMapper.toDTO(saveSentence);
    }

    /**
     * 删除句子
     */
    @Transactional
    @Override
    public void deleteSentence(String id) {
        // 在删除前获取句子信息，用于事件发布
        Sentence sentence = sentenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + id));
        
        sentenceRepository.deleteById(id);
        
        // 发布句子删除事件
        SentenceDeletedEvent event = new SentenceDeletedEvent();
        event.setUserId("system"); // 临时设置，等用户功能添加后修改
        event.setUsername("system"); // 临时设置，等用户功能添加后修改
        event.setSentence(sentence);
        sentenceEventPublisher.publishSentenceDeletedEvent(event);
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
     * 批量删除句子
     */
    @Transactional
    @Override
    public void batchDeleteSentences(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        sentenceRepository.deleteAllById(ids);
    }
}