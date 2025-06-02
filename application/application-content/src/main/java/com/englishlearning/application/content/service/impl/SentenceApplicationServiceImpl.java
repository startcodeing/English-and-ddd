package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.content.service.SentenceApplicationService;
import com.englishlearning.application.vocabulary.dto.WordDTO;
import com.englishlearning.domain.content.command.CreateSentenceDomainDTO;
import com.englishlearning.domain.content.command.UpdateSentenceDTO;
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
    public SentenceDTO addUnfamiliarWord(String sentenceId, WordDTO wordDTO) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        Word word = wordRepository.findById(wordDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("单词不存在: " + wordDTO.getId()));
        sentence.addUnfamiliarWord(word);
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
        sentenceService.deleteSentence(id);
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
}