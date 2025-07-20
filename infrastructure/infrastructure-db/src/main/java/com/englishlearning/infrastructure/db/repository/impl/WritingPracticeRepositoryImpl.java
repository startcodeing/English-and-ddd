package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.domain.practice.model.entity.WritingPractice;
import com.englishlearning.domain.practice.repository.WritingPracticeRepository;
import com.englishlearning.infrastructure.db.mapper.WritingPracticePoMapper;
import com.englishlearning.infrastructure.db.po.WritingPracticePO;
import com.englishlearning.infrastructure.db.repository.jpa.WritingPracticeJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 写作练习仓储实现类
 */
@Repository
@RequiredArgsConstructor
public class WritingPracticeRepositoryImpl implements WritingPracticeRepository {
    
    private final WritingPracticeJpaRepository jpaRepository;
    private final WritingPracticePoMapper mapper;
    
    @Override
    public WritingPractice save(WritingPractice writingPractice) {
        WritingPracticePO po = mapper.toPo(writingPractice);
        WritingPracticePO savedPo = jpaRepository.save(po);
        return mapper.toEntity(savedPo);
    }
    
    @Override
    public Optional<WritingPractice> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toEntity);
    }
    
    @Override
    public List<WritingPractice> findByIdIn(List<Long> ids) {
        return mapper.toEntityList(jpaRepository.findAllById(ids));
    }
    
    @Override
    public List<WritingPractice> findByTopicId(Long topicId) {
        return mapper.toEntityList(jpaRepository.findByTopicId(topicId));
    }
    
    @Override
    public List<WritingPractice> findByStatus(String status) {
        return mapper.toEntityList(jpaRepository.findByStatus(status));
    }
    
    @Override
    public List<WritingPractice> findByTopicIdAndStatus(Long topicId, String status) {
        return mapper.toEntityList(jpaRepository.findByTopicIdAndStatus(topicId, status));
    }
    
    @Override
    public List<WritingPractice> findByPage(Long topicId, String status, int pageNum, int pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize, Sort.by(Sort.Direction.DESC, "createTime"));
        return mapper.toEntityList(jpaRepository.findByConditions(topicId, status, pageRequest).getContent());
    }
    
    @Override
    public long count(Long topicId, String status) {
        return jpaRepository.countByConditions(topicId, status);
    }
    
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public void deleteByIdIn(List<Long> ids) {
        jpaRepository.deleteAllById(ids);
    }
}