package com.englishlearning.domain.content.service.impl;

import com.englishlearning.domain.content.event.SentenceCreatedEvent;
import com.englishlearning.domain.content.event.SentenceUpdatedEvent;
import com.englishlearning.domain.content.event.SentenceEventPublisher;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.model.entity.SentenceVariant;
import com.englishlearning.domain.content.repository.SentenceRepository;
import com.englishlearning.domain.content.service.SentenceService;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 句子领域服务实现
 */
@Service
@RequiredArgsConstructor
@Transactional
public class SentenceServiceImpl implements SentenceService {
    
    private final SentenceRepository sentenceRepository;
    private final SentenceEventPublisher eventPublisher;
    
    @Override
    public Sentence createSentence(Sentence sentence) {
        Sentence savedSentence = sentenceRepository.save(sentence);
        
        // 发布句子创建事件
        eventPublisher.publishSentenceCreatedEvent(new SentenceCreatedEvent(
            savedSentence.getArticleId(),
            savedSentence.getEnglishContent(),
            savedSentence.getChineseMeaning()
        ));
        
        return savedSentence;
    }
    
    @Override
    public Sentence updateSentence(Sentence sentence) {
        Sentence updatedSentence = sentenceRepository.save(sentence);
        eventPublisher.publishSentenceUpdatedEvent(new SentenceUpdatedEvent(
            updatedSentence.getId(),
            updatedSentence.getEnglishContent(),
            updatedSentence.getChineseMeaning(),
            updatedSentence.getArticleId()
        ));
        return updatedSentence;
    }
    
    @Override
    public Optional<Sentence> findSentenceById(String id) {
        return sentenceRepository.findById(id);
    }
    
    @Override
    public List<Sentence> findAllSentences() {
        return sentenceRepository.findAll();
    }
    
    @Override
    public List<Sentence> findSentencesByEnglishContent(String englishContent) {
        return sentenceRepository.findByEnglishContentLike(englishContent);
    }
    
    @Override
    public List<Sentence> findSentencesByChineseMeaning(String chineseMeaning) {
        return sentenceRepository.findByChineseMeaningLike(chineseMeaning);
    }
    
    @Override
    public Sentence addVariant(String sentenceId, SentenceVariant variant) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
            .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        if (sentence.getVariants() == null) {
            sentence.setVariants(new ArrayList<>());
        }
        
        sentence.getVariants().add(variant);
        return sentenceRepository.save(sentence);
    }
    
    @Override
    public Sentence addUnfamiliarWord(String sentenceId, Word word) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
            .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        if (sentence.getUnfamiliarWords() == null) {
            sentence.setUnfamiliarWords(new ArrayList<>());
        }
        
        // 避免重复添加
        boolean wordExists = sentence.getUnfamiliarWords().stream()
            .anyMatch(w -> w.getId().equals(word.getId()));
        
        if (!wordExists) {
            sentence.getUnfamiliarWords().add(word);
        }
        
        return sentenceRepository.save(sentence);
    }
    
    @Override
    public Sentence removeUnfamiliarWord(String sentenceId, String wordId) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
            .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        if (sentence.getUnfamiliarWords() != null) {
            sentence.setUnfamiliarWords(
                sentence.getUnfamiliarWords().stream()
                    .filter(w -> !w.getId().equals(wordId))
                    .collect(Collectors.toList())
            );
        }
        
        return sentenceRepository.save(sentence);
    }
    
    @Override
    public String analyzeSentenceGrammar(String sentenceId) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
            .orElseThrow(() -> new IllegalArgumentException("句子不存在: " + sentenceId));
        
        // 简单实现，实际项目中可能会调用NLP服务或其他分析工具
        String grammarAnalysis = "此句为" + determineStructure(sentence.getEnglishContent());
        sentence.setGrammarAnalysis(grammarAnalysis);
        sentenceRepository.save(sentence);
        
        return grammarAnalysis;
    }
    
    @Override
    public void deleteSentence(String id) {
        sentenceRepository.deleteById(id);
    }
    
    /**
     * 简单的句子结构分析，实际项目中可能会引入更复杂的算法或NLP工具
     */
    private String determineStructure(String content) {
        content = content.toLowerCase();
        if (content.contains(" if ") || content.contains(" unless ")) {
            return "条件句";
        } else if (content.contains(" because ") || content.contains(" since ")) {
            return "原因状语从句";
        } else if (content.contains(" when ") || content.contains(" while ")) {
            return "时间状语从句";
        } else if (content.contains(" that ") || content.contains(" which ")) {
            return "定语从句";
        } else {
            return "简单句";
        }
    }
} 