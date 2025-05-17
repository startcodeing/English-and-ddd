package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.common.utils.UUIDGenerator;
import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.repository.WordRepository;
import com.englishlearning.infrastructure.db.mapper.WordMeaningPoMapper;
import com.englishlearning.infrastructure.db.mapper.WordPoMapper;
import com.englishlearning.infrastructure.db.po.WordMeaningPO;
import com.englishlearning.infrastructure.db.po.WordPO;
import com.englishlearning.infrastructure.db.repository.jpa.WordJpaRepository;
import com.englishlearning.infrastructure.db.repository.jpa.WordMeaningJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 单词仓储实现
 */
@Repository
@RequiredArgsConstructor
public class WordRepositoryImpl implements WordRepository {
    
    private final WordJpaRepository jpaRepository;
    private final WordMeaningJpaRepository meaningJpaRepository;
    private final WordPoMapper mapper;
    private final WordMeaningPoMapper meaningMapper;
    private final UUIDGenerator uuidGenerator;
    
    @Override
    public Word save(Word word) {
        if (!StringUtils.hasText(word.getId())) {
            word.setId(uuidGenerator.generateUUID());
        }
        
        // 确保每个词义都有ID
        if (word.getMeanings() != null) {
            for (WordMeaning meaning : word.getMeanings()) {
                if (!StringUtils.hasText(meaning.getId())) {
                    meaning.setId(uuidGenerator.generateUUID());
                }
            }
        }
        
        WordPO wordPO = mapper.toPo(word);
        
        // 设置时间戳
        long now = System.currentTimeMillis();
        if (wordPO.getCreatedAt() == null) {
            wordPO.setCreatedAt(now);
        }
        wordPO.setUpdatedAt(now);
        
        // 设置词义的时间戳和单词ID
        if (wordPO.getMeanings() != null) {
            for (WordMeaningPO meaningPO : wordPO.getMeanings()) {
                meaningPO.setWordId(word.getId());
                if (meaningPO.getCreatedAt() == null) {
                    meaningPO.setCreatedAt(now);
                }
                meaningPO.setUpdatedAt(now);
            }
        }
        
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
        // 查找包含特定中文意思的词义
        List<WordMeaningPO> meaningPOs = meaningJpaRepository.findByChineseMeaningContaining(chineseMeaning);
        
        // 获取这些词义对应的单词ID
        List<String> wordIds = new ArrayList<>();
        for (WordMeaningPO meaningPO : meaningPOs) {
            if (!wordIds.contains(meaningPO.getWordId())) {
                wordIds.add(meaningPO.getWordId());
            }
        }
        
        // 查询这些单词
        List<WordPO> wordPOs = jpaRepository.findAllById(wordIds);
        return mapper.toEntityList(wordPOs);
    }
    
    @Override
    public List<Word> findByPartOfSpeechId(String partOfSpeechId) {
        // 查找特定词性的词义
        List<WordMeaningPO> meaningPOs = meaningJpaRepository.findByPartOfSpeechId(partOfSpeechId);
        
        // 获取这些词义对应的单词ID
        List<String> wordIds = new ArrayList<>();
        for (WordMeaningPO meaningPO : meaningPOs) {
            if (!wordIds.contains(meaningPO.getWordId())) {
                wordIds.add(meaningPO.getWordId());
            }
        }
        
        // 查询这些单词
        List<WordPO> wordPOs = jpaRepository.findAllById(wordIds);
        return mapper.toEntityList(wordPOs);
    }
    
    @Override
    public List<Word> findAll() {
        return mapper.toEntityList(jpaRepository.findAll());
    }
    
    @Override
    public void deleteById(String id) {
        // 先删除单词的所有词义
        meaningJpaRepository.deleteByWordId(id);
        // 再删除单词本身
        jpaRepository.deleteById(id);
    }
}