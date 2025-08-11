package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.domain.content.model.entity.GrammarAnalysis;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.domain.content.repository.GrammarAnalysisRepository;
import com.englishlearning.infrastructure.db.po.GrammarAnalysisPo;
import com.englishlearning.infrastructure.db.repository.jpa.GrammarAnalysisJpaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
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

    private final GrammarAnalysisJpaRepository jpaRepository;

    public GrammarAnalysisRepositoryImpl(GrammarAnalysisJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

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
        Specification<GrammarAnalysisPo> spec = buildSearchSpecification(title, difficulty);
        return jpaRepository.findAll(spec, PageRequest.of(page, size)).getContent().stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
    }

    @Override
    public long countByCondition(String title, String difficulty) {
        Specification<GrammarAnalysisPo> spec = buildSearchSpecification(title, difficulty);
        return jpaRepository.count(spec);
    }

    /**
     * 构建搜索条件规范
     *
     * @param title 标题搜索条件
     * @param difficulty 难度级别搜索条件
     * @return 搜索规范
     */
    private Specification<GrammarAnalysisPo> buildSearchSpecification(String title, String difficulty) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (title != null && !title.isEmpty()) {
                predicates.add(cb.like(root.get("title"), "%" + title + "%"));
            }
            if (difficulty != null && !difficulty.isEmpty()) {
                try {
                    DifficultyLevel difficultyLevel = DifficultyLevel.fromCode(difficulty);
                    predicates.add(cb.equal(root.get("difficulty"), difficultyLevel));
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid difficulty level code: {}", difficulty);
                    // 如果难度级别无效，添加一个永远不会匹配的条件
                    predicates.add(cb.equal(root.get("id"), -1L));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
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