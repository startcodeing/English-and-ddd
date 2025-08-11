package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.domain.content.model.GrammarAnalysis;
import com.englishlearning.domain.content.repository.GrammarAnalysisRepository;
import com.englishlearning.infrastructure.db.po.GrammarAnalysisPo;
import com.englishlearning.infrastructure.db.repository.jpa.GrammarAnalysisJpaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class GrammarAnalysisRepositoryImpl implements GrammarAnalysisRepository {

    private static final Logger logger = LoggerFactory.getLogger(GrammarAnalysisRepositoryImpl.class);

    @Autowired
    private GrammarAnalysisJpaRepository jpaRepository;

    @Override
    public GrammarAnalysis save(GrammarAnalysis grammarAnalysis) {
        GrammarAnalysisPo po = new GrammarAnalysisPo();
        BeanUtils.copyProperties(grammarAnalysis, po);
        GrammarAnalysisPo savedPo = jpaRepository.save(po);
        BeanUtils.copyProperties(savedPo, grammarAnalysis);
        return grammarAnalysis;
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public void deleteAllById(Iterable<Long> ids) {
        jpaRepository.deleteAllById(ids);
    }

    @Override
    public Optional<GrammarAnalysis> findById(Long id) {
        return jpaRepository.findById(id).map(this::convertToEntity);
    }

    @Override
    public List<GrammarAnalysis> findAll() {
        return jpaRepository.findAll().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<GrammarAnalysis> findByCondition(String title, String difficulty, int page, int size) {
        Specification<GrammarAnalysisPo> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (title != null && !title.isEmpty()) {
                predicates.add(cb.like(root.get("title"), "%" + title + "%"));
            }
            if (difficulty != null && !difficulty.isEmpty()) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return jpaRepository.findAll(spec, PageRequest.of(page, size)).getContent().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
    }

    @Override
    public long countByCondition(String title, String difficulty) {
        Specification<GrammarAnalysisPo> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (title != null && !title.isEmpty()) {
                predicates.add(cb.like(root.get("title"), "%" + title + "%"));
            }
            if (difficulty != null && !difficulty.isEmpty()) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return jpaRepository.count(spec);
    }

    /**
     * 将PO转换为实体
     */
    private GrammarAnalysis convertToEntity(GrammarAnalysisPo po) {
        GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
        BeanUtils.copyProperties(po, grammarAnalysis);
        // 调试日志：查看从数据库读取的值
        logger.info("Debug - PO difficulty: {}", po.getDifficulty());
        logger.info("Debug - Entity difficulty after copy: {}", grammarAnalysis.getDifficulty());
        // 手动设置枚举字段，确保正确转换
        if (po.getDifficulty() != null) {
            grammarAnalysis.setDifficulty(po.getDifficulty());
            logger.info("Debug - Entity difficulty after manual set: {}", grammarAnalysis.getDifficulty());
        }
        return grammarAnalysis;
    }
}