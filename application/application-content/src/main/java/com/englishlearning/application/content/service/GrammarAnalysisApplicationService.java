package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.GrammarAnalysisDTO;
import com.englishlearning.domain.content.model.GrammarAnalysis;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.domain.content.repository.GrammarAnalysisRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GrammarAnalysisApplicationService {

    private static final Logger logger = LoggerFactory.getLogger(GrammarAnalysisApplicationService.class);

    @Autowired
    private GrammarAnalysisRepository grammarAnalysisRepository;

    public GrammarAnalysisDTO createGrammarAnalysis(GrammarAnalysisDTO grammarAnalysisDTO) {
        GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
        BeanUtils.copyProperties(grammarAnalysisDTO, grammarAnalysis);
        grammarAnalysis.setDifficulty(DifficultyLevel.fromCode(grammarAnalysisDTO.getDifficulty()));
        grammarAnalysis = grammarAnalysisRepository.save(grammarAnalysis);
        return convertToDTO(grammarAnalysis);
    }

    public GrammarAnalysisDTO updateGrammarAnalysis(GrammarAnalysisDTO grammarAnalysisDTO) {
        GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
        BeanUtils.copyProperties(grammarAnalysisDTO, grammarAnalysis);
        grammarAnalysis.setDifficulty(DifficultyLevel.fromCode(grammarAnalysisDTO.getDifficulty()));
        grammarAnalysis = grammarAnalysisRepository.save(grammarAnalysis);
        return convertToDTO(grammarAnalysis);
    }

    public void deleteGrammarAnalysis(Long id) {
        grammarAnalysisRepository.deleteById(id);
    }

    public Optional<GrammarAnalysisDTO> findGrammarAnalysisById(Long id) {
        return grammarAnalysisRepository.findById(id).map(this::convertToDTO);
    }

    public List<GrammarAnalysisDTO> findGrammarAnalysisByCondition(String title, String difficulty, int page, int size) {
        return grammarAnalysisRepository.findByCondition(title, difficulty, page, size).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long countGrammarAnalysisByCondition(String title, String difficulty) {
        return grammarAnalysisRepository.countByCondition(title, difficulty);
    }

    /**
     * 批量删除语法分析
     */
    public void batchDeleteGrammarAnalyses(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        grammarAnalysisRepository.deleteAllById(ids);
    }

    /**
     * 将实体转换为DTO
     */
    private GrammarAnalysisDTO convertToDTO(GrammarAnalysis grammarAnalysis) {
        GrammarAnalysisDTO dto = new GrammarAnalysisDTO();
        BeanUtils.copyProperties(grammarAnalysis, dto);
        // 调试日志：查看实体中的difficulty值
        logger.info("Debug - Entity difficulty: {}", grammarAnalysis.getDifficulty());
        // 将DifficultyLevel枚举转换为字符串
        if (grammarAnalysis.getDifficulty() != null) {
            dto.setDifficulty(grammarAnalysis.getDifficulty().getCode());
            logger.info("Debug - DTO difficulty after conversion: {}", dto.getDifficulty());
        } else {
            logger.info("Debug - Entity difficulty is null, DTO difficulty will be null");
        }
        return dto;
    }
}