package com.englishlearning.application.content.service;

import com.englishlearning.application.content.dto.GrammarAnalysisDTO;
import com.englishlearning.domain.content.model.GrammarAnalysis;
import com.englishlearning.domain.content.repository.GrammarAnalysisRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GrammarAnalysisApplicationService {

    @Autowired
    private GrammarAnalysisRepository grammarAnalysisRepository;

    public GrammarAnalysisDTO createGrammarAnalysis(GrammarAnalysisDTO grammarAnalysisDTO) {
        GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
        BeanUtils.copyProperties(grammarAnalysisDTO, grammarAnalysis);
        grammarAnalysis = grammarAnalysisRepository.save(grammarAnalysis);
        BeanUtils.copyProperties(grammarAnalysis, grammarAnalysisDTO);
        return grammarAnalysisDTO;
    }

    public GrammarAnalysisDTO updateGrammarAnalysis(GrammarAnalysisDTO grammarAnalysisDTO) {
        GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
        BeanUtils.copyProperties(grammarAnalysisDTO, grammarAnalysis);
        grammarAnalysis = grammarAnalysisRepository.save(grammarAnalysis);
        BeanUtils.copyProperties(grammarAnalysis, grammarAnalysisDTO);
        return grammarAnalysisDTO;
    }

    public void deleteGrammarAnalysis(Long id) {
        grammarAnalysisRepository.deleteById(id);
    }

    public Optional<GrammarAnalysisDTO> findGrammarAnalysisById(Long id) {
        return grammarAnalysisRepository.findById(id).map(grammarAnalysis -> {
            GrammarAnalysisDTO dto = new GrammarAnalysisDTO();
            BeanUtils.copyProperties(grammarAnalysis, dto);
            return dto;
        });
    }

    public List<GrammarAnalysisDTO> findGrammarAnalysisByCondition(String title, String difficulty, int page, int size) {
        return grammarAnalysisRepository.findByCondition(title, difficulty, page, size).stream().map(grammarAnalysis -> {
            GrammarAnalysisDTO dto = new GrammarAnalysisDTO();
            BeanUtils.copyProperties(grammarAnalysis, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    public long countGrammarAnalysisByCondition(String title, String difficulty) {
        return grammarAnalysisRepository.countByCondition(title, difficulty);
    }
}