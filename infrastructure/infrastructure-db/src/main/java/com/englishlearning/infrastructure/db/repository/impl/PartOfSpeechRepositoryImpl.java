package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.common.utils.UUIDGenerator;
import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.domain.vocabulary.repository.PartOfSpeechRepository;
import com.englishlearning.infrastructure.db.mapper.PartOfSpeechPoMapper;
import com.englishlearning.infrastructure.db.po.PartOfSpeechPO;
import com.englishlearning.infrastructure.db.repository.jpa.PartOfSpeechJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * 词性仓储实现类
 */
@Repository
@RequiredArgsConstructor
public class PartOfSpeechRepositoryImpl implements PartOfSpeechRepository {
    
    private final PartOfSpeechJpaRepository jpaRepository;
    private final PartOfSpeechPoMapper mapper;
    private final UUIDGenerator uuidGenerator;
    
    /**
     * 保存词性
     */
    @Override
    public PartOfSpeech save(PartOfSpeech partOfSpeech) {
        if (Objects.isNull(partOfSpeech.getId())) {
            partOfSpeech.setId(uuidGenerator.generateUUID());
        }
        PartOfSpeechPO po = mapper.toPo(partOfSpeech);
        po = jpaRepository.save(po);
        return mapper.toEntity(po);
    }
    
    /**
     * 根据ID查找词性
     */
    @Override
    public Optional<PartOfSpeech> findById(String id) {
        return jpaRepository.findById(id)
            .map(mapper::toEntity);
    }

    /**
     * 根据英文名称查找词性
     */
    @Override
    public Optional<PartOfSpeech> findByEnglishName(String englishName) {
        return jpaRepository.findByEnglishName(englishName)
            .map(mapper::toEntity);
    }
    
    /**
     * 查询所有词性
     */
    @Override
    public List<PartOfSpeech> findAll() {
        return mapper.toEntityList(jpaRepository.findAll());
    }
    
    /**
     * 删除词性
     */
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
    
    /**
     * 批量删除词性
     */
    @Override
    public void deleteAllById(List<String> ids) {
        ids.forEach(this::deleteById);
    }
}