package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.GrammarAnalysisDTO;
import com.englishlearning.application.content.service.GrammarAnalysisApplicationService;
import com.englishlearning.domain.content.event.*;
import com.englishlearning.domain.content.model.entity.GrammarAnalysis;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.domain.content.repository.GrammarAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 语法分析应用服务实现类
 */
@Service
@RequiredArgsConstructor
public class GrammarAnalysisApplicationServiceImpl implements GrammarAnalysisApplicationService {
    
    private static final Logger logger = LoggerFactory.getLogger(GrammarAnalysisApplicationServiceImpl.class);
    
    private final GrammarAnalysisRepository grammarAnalysisRepository;
    private final GrammarAnalysisEventPublisher eventPublisher;

    /**
     * 创建语法分析
     */
    @Transactional
    @Override
    public GrammarAnalysisDTO createGrammarAnalysis(GrammarAnalysisDTO grammarAnalysisDTO) {
        logger.info("Creating grammar analysis: {}", grammarAnalysisDTO.getTitle());
        
        GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
        BeanUtils.copyProperties(grammarAnalysisDTO, grammarAnalysis);
        grammarAnalysis.setDifficulty(DifficultyLevel.fromCode(grammarAnalysisDTO.getDifficulty()));
        grammarAnalysis.setCreateTime(LocalDateTime.now());
        grammarAnalysis.setUpdateTime(LocalDateTime.now());
        
        GrammarAnalysis saved = grammarAnalysisRepository.save(grammarAnalysis);
        
        // 发布语法分析创建事件
        GrammarAnalysisCreatedEvent event = new GrammarAnalysisCreatedEvent(
            "system", // 临时设置，等用户功能添加后修改
            "system", // 临时设置，等用户功能添加后修改
            saved
        );
        eventPublisher.publishGrammarAnalysisCreatedEvent(event);
        
        return convertToDTO(saved);
    }

    /**
     * 更新语法分析
     */
    @Transactional
    @Override
    public GrammarAnalysisDTO updateGrammarAnalysis(Long id, GrammarAnalysisDTO grammarAnalysisDTO) {
        logger.info("Updating grammar analysis: {}", id);
        
        GrammarAnalysis existing = grammarAnalysisRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grammar analysis not found: " + id));
        
        // 设置ID确保一致性
        grammarAnalysisDTO.setId(id);
        
        BeanUtils.copyProperties(grammarAnalysisDTO, existing, "id", "createTime");
        existing.setDifficulty(DifficultyLevel.fromCode(grammarAnalysisDTO.getDifficulty()));
        existing.setUpdateTime(LocalDateTime.now());
        
        GrammarAnalysis saved = grammarAnalysisRepository.save(existing);
        
        // 发布语法分析更新事件
        GrammarAnalysisUpdatedEvent event = new GrammarAnalysisUpdatedEvent(
            "system", // 临时设置，等用户功能添加后修改
            "system", // 临时设置，等用户功能添加后修改
            saved
        );
        eventPublisher.publishGrammarAnalysisUpdatedEvent(event);
        
        return convertToDTO(saved);
    }

    /**
     * 删除语法分析
     */
    @Transactional
    @Override
    public void deleteGrammarAnalysis(Long id) {
        logger.info("Deleting grammar analysis: {}", id);
        
        // 在删除前获取语法分析信息，用于事件发布
        GrammarAnalysis grammarAnalysis = grammarAnalysisRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grammar analysis not found: " + id));
        
        grammarAnalysisRepository.deleteById(id);
        
        // 发布语法分析删除事件
        GrammarAnalysisDeletedEvent event = GrammarAnalysisDeletedEvent.builder()
                .userId("system") // 临时设置，等用户功能添加后修改
                .username("system") // 临时设置，等用户功能添加后修改
                .grammarAnalysis(grammarAnalysis)
                .build();
        eventPublisher.publishGrammarAnalysisDeletedEvent(event);
    }



    /**
     * 批量删除语法分析
     */
    @Transactional
    @Override
    public void batchDeleteGrammarAnalyses(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        
        logger.info("Batch deleting grammar analyses: {}", ids);
        
        // 在删除前获取语法分析信息，用于事件发布
        List<GrammarAnalysis> grammarAnalyses = ids.stream()
                .map(id -> grammarAnalysisRepository.findById(id).orElse(null))
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
        
        grammarAnalysisRepository.deleteAllById(ids);
        
        // 发布语法分析批量删除事件
        GrammarAnalysisBatchDeletedEvent event = GrammarAnalysisBatchDeletedEvent.builder()
                .userId("system") // 临时设置，等用户功能添加后修改
                .username("system") // 临时设置，等用户功能添加后修改
                .grammarAnalysisIds(ids)
                .grammarAnalyses(grammarAnalyses)
                .build();
        eventPublisher.publishGrammarAnalysisBatchDeletedEvent(event);
        
        logger.info("Batch deleted {} grammar analyses", ids.size());
    }
    
    @Override
    public Optional<GrammarAnalysisDTO> findGrammarAnalysisById(Long id) {
        return grammarAnalysisRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    @Override
    public List<GrammarAnalysisDTO> findAllGrammarAnalyses() {
        return grammarAnalysisRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<GrammarAnalysisDTO> findGrammarAnalysesByCondition(String title, String difficulty, int page, int size) {
        return grammarAnalysisRepository.findByCondition(title, difficulty, page, size).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public long countGrammarAnalysisByCondition(String title, Integer difficulty) {
        String difficultyStr = difficulty != null ? difficulty.toString() : null;
        return grammarAnalysisRepository.countByCondition(title, difficultyStr);
    }
    
    /**
     * 将实体转换为DTO
     */
    private GrammarAnalysisDTO convertToDTO(GrammarAnalysis grammarAnalysis) {
        GrammarAnalysisDTO dto = new GrammarAnalysisDTO();
        BeanUtils.copyProperties(grammarAnalysis, dto);
        dto.setDifficulty(grammarAnalysis.getDifficulty().getCode());
        return dto;
    }
}