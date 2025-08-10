package com.englishlearning.infrastructure.db.repository.content;

import com.englishlearning.domain.content.model.GrammarAnalysis;
import com.englishlearning.domain.content.repository.GrammarAnalysisRepository;
import com.englishlearning.infrastructure.db.entity.content.GrammarAnalysisPo;
import com.englishlearning.infrastructure.db.jpa.content.GrammarAnalysisJpaRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Optional<GrammarAnalysis> findById(Long id) {
        return jpaRepository.findById(id).map(po -> {
            GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
            BeanUtils.copyProperties(po, grammarAnalysis);
            return grammarAnalysis;
        });
    }

    @Override
    public List<GrammarAnalysis> findAll() {
        return jpaRepository.findAll().stream().map(po -> {
            GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
            BeanUtils.copyProperties(po, grammarAnalysis);
            return grammarAnalysis;
        }).collect(Collectors.toList());
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
        return jpaRepository.findAll(spec, PageRequest.of(page, size)).getContent().stream().map(po -> {
            GrammarAnalysis grammarAnalysis = new GrammarAnalysis();
            BeanUtils.copyProperties(po, grammarAnalysis);
            return grammarAnalysis;
        }).collect(Collectors.toList());
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
}