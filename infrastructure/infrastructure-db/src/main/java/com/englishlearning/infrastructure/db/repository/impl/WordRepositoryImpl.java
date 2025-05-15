package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.common.utils.UUIDGenerator;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import com.englishlearning.infrastructure.db.mapper.WordPoMapper;
import com.englishlearning.infrastructure.db.po.WordPO;
import com.englishlearning.infrastructure.db.repository.jpa.WordJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

/**
 * 单词仓储实现
 */
@Repository
@RequiredArgsConstructor
public class WordRepositoryImpl implements WordRepository {
    
    private final WordJpaRepository jpaRepository;
    private final WordPoMapper mapper;
    private final UUIDGenerator uuidGenerator;
    
    @Override
    public Word save(Word word) {
        if (!StringUtils.hasText(word.getId())) {
            word.setId(uuidGenerator.generateUUID());
        }
        
        WordPO wordPO = mapper.toPo(word);
        
        // 设置时间戳
        long now = System.currentTimeMillis();
        if (wordPO.getCreatedAt() == null) {
            wordPO.setCreatedAt(now);
        }
        wordPO.setUpdatedAt(now);
        
        WordPO savedPO = jpaRepository.save(wordPO);
        return mapper.toEntity(savedPO);
    }
    
    @Override
    public Optional<Word> findById(String id) {
        return jpaRepository.findById(id)
            .map(mapper::toEntity);
    }
    
    @Override
    public Optional<Word> findBySpelling(String spelling) {
        return jpaRepository.findBySpelling(spelling)
            .map(mapper::toEntity);
    }
    
    @Override
    public List<Word> findBySpellingIn(List<String> spellings) {
        return mapper.toEntityList(
            jpaRepository.findBySpellingIn(spellings)
        );
    }
    
    @Override
    public List<Word> findByChineseMeaningLike(String chineseMeaning) {
        return mapper.toEntityList(
            jpaRepository.findByChineseMeaningContaining(chineseMeaning)
        );
    }
    
    @Override
    public List<Word> findByPartOfSpeechId(String partOfSpeechId) {
        return mapper.toEntityList(
            jpaRepository.findByPartOfSpeechId(partOfSpeechId)
        );
    }
    
    @Override
    public List<Word> findAll() {
        return mapper.toEntityList(jpaRepository.findAll());
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
} 