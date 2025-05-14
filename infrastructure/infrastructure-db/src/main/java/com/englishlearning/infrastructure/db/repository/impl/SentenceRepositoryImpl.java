package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.common.utils.UUIDGenerator;
import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.domain.content.repository.SentenceRepository;
import com.englishlearning.infrastructure.db.mapper.SentencePoMapper;
import com.englishlearning.infrastructure.db.po.SentencePO;
import com.englishlearning.infrastructure.db.repository.jpa.SentenceJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

/**
 * 句子仓储实现
 */
@Repository
@RequiredArgsConstructor
public class SentenceRepositoryImpl implements SentenceRepository {
    
    private final SentenceJpaRepository jpaRepository;
    private final SentencePoMapper mapper;
    private final UUIDGenerator uuidGenerator;
    
    @Override
    public Sentence save(Sentence sentence) {
        if (!StringUtils.hasText(sentence.getId())) {
            sentence.setId(uuidGenerator.generateUUID());
        }
        SentencePO sentencePO = mapper.toPo(sentence);
        SentencePO savedPO = jpaRepository.save(sentencePO);
        return mapper.toEntity(savedPO);
    }
    
    @Override
    public Optional<Sentence> findById(String id) {
        return jpaRepository.findById(id)
            .map(mapper::toEntity);
    }
    
    @Override
    public List<Sentence> findByEnglishContentLike(String englishContent) {
        return mapper.toEntityList(
            jpaRepository.findByEnglishContentContaining(englishContent)
        );
    }
    
    @Override
    public List<Sentence> findByChineseMeaningLike(String chineseMeaning) {
        return mapper.toEntityList(
            jpaRepository.findByChineseMeaningContaining(chineseMeaning)
        );
    }
    
    @Override
    public List<Sentence> findAll() {
        return mapper.toEntityList(jpaRepository.findAll());
    }
    
    @Override
    public List<Sentence> findByUnfamiliarWordId(String wordId) {
        return mapper.toEntityList(
            jpaRepository.findByUnfamiliarWordId(wordId)
        );
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
} 