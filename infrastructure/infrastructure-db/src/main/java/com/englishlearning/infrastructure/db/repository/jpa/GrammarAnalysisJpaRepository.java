package com.englishlearning.infrastructure.db.repository.jpa;

import com.englishlearning.infrastructure.db.po.GrammarAnalysisPo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface GrammarAnalysisJpaRepository extends JpaRepository<GrammarAnalysisPo, Long>, JpaSpecificationExecutor<GrammarAnalysisPo> {
}