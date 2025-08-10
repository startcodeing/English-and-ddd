package com.englishlearning.infrastructure.db.jpa.content;

import com.englishlearning.infrastructure.db.entity.content.GrammarAnalysisPo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface GrammarAnalysisJpaRepository extends JpaRepository<GrammarAnalysisPo, Long>, JpaSpecificationExecutor<GrammarAnalysisPo> {
}