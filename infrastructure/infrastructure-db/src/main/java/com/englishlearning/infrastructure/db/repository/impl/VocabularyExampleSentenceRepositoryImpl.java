package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.common.utils.UUIDGenerator;
import com.englishlearning.domain.vocabulary.model.entity.VocabularyExampleSentence;
import com.englishlearning.domain.vocabulary.repository.VocabularyExampleSentenceRepository;
import com.englishlearning.infrastructure.db.mapper.VocabularyExampleSentencePoMapper;
import com.englishlearning.infrastructure.db.po.VocabularyExampleSentencePO;
import com.englishlearning.infrastructure.db.repository.jpa.VocabularyExampleSentenceJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

/**
 * 词汇例句仓储实现
 */
@Repository
@RequiredArgsConstructor
public class VocabularyExampleSentenceRepositoryImpl implements VocabularyExampleSentenceRepository {
    
    private final VocabularyExampleSentenceJpaRepository jpaRepository;
    private final VocabularyExampleSentencePoMapper mapper;
    private final UUIDGenerator uuidGenerator;
    
    @Override
    public VocabularyExampleSentence save(VocabularyExampleSentence sentence) {
        if (!StringUtils.hasText(sentence.getId())) {
            sentence.setId(uuidGenerator.generateUUID());
        }
        
        VocabularyExampleSentencePO po = mapper.toPo(sentence);
        
        // 设置时间戳
        long now = System.currentTimeMillis();
        if (po.getCreatedAt() == null) {
            po.setCreatedAt(now);
        }
        po.setUpdatedAt(now);
        
        VocabularyExampleSentencePO savedPO = jpaRepository.save(po);
        return mapper.toEntity(savedPO);
    }
    
    @Override
    public Optional<VocabularyExampleSentence> findById(String id) {
        return jpaRepository.findById(id)
            .map(mapper::toEntity);
    }
    
    @Override
    public List<VocabularyExampleSentence> findBySentenceContaining(String sentence) {
        return mapper.toEntityList(
            jpaRepository.findBySentenceContaining(sentence)
        );
    }
    
    @Override
    public List<VocabularyExampleSentence> findByTranslationContaining(String translation) {
        return mapper.toEntityList(
            jpaRepository.findByTranslationContaining(translation)
        );
    }
    
    @Override
    public List<VocabularyExampleSentence> findAll() {
        return mapper.toEntityList(jpaRepository.findAll());
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
}