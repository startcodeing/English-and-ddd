package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.domain.practice.model.entity.DictationPractice;
import com.englishlearning.domain.practice.repository.DictationPracticeRepository;
import com.englishlearning.infrastructure.db.mapper.DictationPracticePoMapper;
import com.englishlearning.infrastructure.db.po.DictationPracticePO;
import com.englishlearning.infrastructure.db.repository.jpa.DictationPracticeJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 听写练习仓储实现类
 */
@Repository
@RequiredArgsConstructor
public class DictationPracticeRepositoryImpl implements DictationPracticeRepository {
    
    private final DictationPracticeJpaRepository dictationPracticeJpaRepository;
    private final DictationPracticePoMapper dictationPracticePoMapper;
    
    @Override
    public DictationPractice save(DictationPractice dictationPractice) {
        DictationPracticePO dictationPracticePO = dictationPracticePoMapper.toPO(dictationPractice);
        DictationPracticePO savedPO = dictationPracticeJpaRepository.save(dictationPracticePO);
        return dictationPracticePoMapper.toEntity(savedPO);
    }
    
    @Override
    public Optional<DictationPractice> findById(Long id) {
        Optional<DictationPracticePO> dictationPracticePO = dictationPracticeJpaRepository.findById(id);
        return dictationPracticePO.map(dictationPracticePoMapper::toEntity);
    }
    
    @Override
    public List<DictationPractice> findByIdIn(List<Long> ids) {
        List<DictationPracticePO> dictationPracticePOs = dictationPracticeJpaRepository.findAllById(ids);
        return dictationPracticePoMapper.toEntityList(dictationPracticePOs);
    }
    
    @Override
    public List<DictationPractice> findByListenMaterialId(Long listenMaterialId) {
        List<DictationPracticePO> dictationPracticePOs = dictationPracticeJpaRepository.findByListenMaterialId(listenMaterialId);
        return dictationPracticePoMapper.toEntityList(dictationPracticePOs);
    }
    
    @Override
    public List<DictationPractice> findByStatus(String status) {
        List<DictationPracticePO> dictationPracticePOs = dictationPracticeJpaRepository.findByStatus(status);
        return dictationPracticePoMapper.toEntityList(dictationPracticePOs);
    }
    
    @Override
    public List<DictationPractice> findByListenMaterialIdAndStatus(Long listenMaterialId, String status) {
        List<DictationPracticePO> dictationPracticePOs = dictationPracticeJpaRepository.findByListenMaterialIdAndStatus(listenMaterialId, status);
        return dictationPracticePoMapper.toEntityList(dictationPracticePOs);
    }
    
    @Override
    public List<DictationPractice> findByPage(Long listenMaterialId, String status, int pageNum, int pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize, Sort.by(Sort.Direction.DESC, "createTime"));
        List<DictationPracticePO> dictationPracticePOs = dictationPracticeJpaRepository
                .findByConditions(listenMaterialId, status, pageRequest)
                .getContent();
        return dictationPracticePoMapper.toEntityList(dictationPracticePOs);
    }
    
    @Override
    public long count(Long listenMaterialId, String status) {
        return dictationPracticeJpaRepository.countByConditions(listenMaterialId, status);
    }
    
    @Override
    public void deleteById(Long id) {
        dictationPracticeJpaRepository.deleteById(id);
    }
    
    @Override
    public void deleteByIdIn(List<Long> ids) {
        dictationPracticeJpaRepository.deleteByIdIn(ids);
    }
}