package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import com.englishlearning.domain.vocabulary.repository.WordBookRepository;
import com.englishlearning.infrastructure.db.mapper.WordBookPoMapper;
import com.englishlearning.infrastructure.db.po.WordBookPO;
import com.englishlearning.infrastructure.db.repository.jpa.WordBookJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 单词本仓储实现类
 */
@Repository
@RequiredArgsConstructor
public class WordBookRepositoryImpl implements WordBookRepository {
    
    private final WordBookJpaRepository jpaRepository;
    private final WordBookPoMapper mapper;
    
    /**
     * 保存单词本
     */
    @Override
    public WordBook save(WordBook wordBook) {
        WordBookPO po = mapper.toPo(wordBook);
        po = jpaRepository.save(po);
        return mapper.toEntity(po);
    }
    
    /**
     * 根据ID查找单词本
     */
    @Override
    public Optional<WordBook> findById(String id) {
        try {
            Long longId = Long.parseLong(id);
            return jpaRepository.findById(longId)
                .map(mapper::toEntity);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }
    
    /**
     * 根据名称查找单词本
     */
    @Override
    public Optional<WordBook> findByName(String name) {
        return jpaRepository.findByName(name)
            .map(mapper::toEntity);
    }
    
    /**
     * 查询所有单词本
     */
    @Override
    public List<WordBook> findAll() {
        return mapper.toEntityList(jpaRepository.findAll());
    }
    
    /**
     * 删除单词本
     */
    @Override
    public void deleteById(String id) {
        try {
            Long longId = Long.parseLong(id);
            jpaRepository.deleteById(longId);
        } catch (NumberFormatException e) {
            // 如果ID格式不正确，则不执行删除操作
        }
    }
}