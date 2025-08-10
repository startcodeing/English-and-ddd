package com.englishlearning.domain.content.repository;

import com.englishlearning.domain.content.model.GrammarAnalysis;

import java.util.List;
import java.util.Optional;

public interface GrammarAnalysisRepository {
    GrammarAnalysis save(GrammarAnalysis grammarAnalysis);

    void deleteById(Long id);

    Optional<GrammarAnalysis> findById(Long id);

    List<GrammarAnalysis> findAll();

    List<GrammarAnalysis> findByCondition(String title, String difficulty, int page, int size);

    long countByCondition(String title, String difficulty);
}