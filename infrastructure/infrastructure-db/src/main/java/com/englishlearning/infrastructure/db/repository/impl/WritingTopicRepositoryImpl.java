package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.domain.content.model.entity.WritingTopic;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.domain.content.repository.WritingTopicRepository;
import com.englishlearning.infrastructure.db.mapper.WritingTopicPoMapper;
import com.englishlearning.infrastructure.db.po.WritingTopicPO;
import com.englishlearning.infrastructure.db.repository.jpa.WritingTopicJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 写作主题仓储实现类
 */
@Repository
@RequiredArgsConstructor
public class WritingTopicRepositoryImpl implements WritingTopicRepository {
    
    private final WritingTopicJpaRepository jpaRepository;
    private final WritingTopicPoMapper mapper;
    
    @Override
    public WritingTopic save(WritingTopic writingTopic) {
        WritingTopicPO po = mapper.toPo(writingTopic);
        WritingTopicPO savedPo = jpaRepository.save(po);
        return mapper.toEntity(savedPo);
    }
    
    @Override
    public Optional<WritingTopic> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toEntity);
    }
    
    @Override
    public List<WritingTopic> findByDescriptionLike(String description) {
        return mapper.toEntityList(
                jpaRepository.findByDescriptionContaining(description)
        );
    }
    
    @Override
    public List<WritingTopic> findBySource(String source) {
        return mapper.toEntityList(
                jpaRepository.findBySource(source)
        );
    }
    
    @Override
    public List<WritingTopic> findByDifficulty(DifficultyLevel difficulty) {
        return mapper.toEntityList(
                jpaRepository.findByDifficulty(difficulty.name())
        );
    }
    
    @Override
    public List<WritingTopic> findAll() {
        return mapper.toEntityList(
                jpaRepository.findAll(Sort.by(Sort.Direction.DESC, "createTime"))
        );
    }
    
    @Override
    public List<WritingTopic> findAll(int pageNum, int pageSize) {
        return mapper.toEntityList(
                jpaRepository.findAll(
                        PageRequest.of(pageNum - 1, pageSize, Sort.by(Sort.Direction.DESC, "createTime"))
                ).getContent()
        );
    }
    
    @Override
    public List<WritingTopic> findByCondition(String description, String source, DifficultyLevel difficulty, int pageNum, int pageSize) {
        String difficultyStr = difficulty != null ? difficulty.name() : null;
        return mapper.toEntityList(
                jpaRepository.findByCondition(
                        description,
                        source,
                        difficultyStr,
                        PageRequest.of(pageNum - 1, pageSize, Sort.by(Sort.Direction.DESC, "createTime"))
                ).getContent()
        );
    }
    
    @Override
    public long count() {
        return jpaRepository.count();
    }
    
    @Override
    public long countByCondition(String description, String source, DifficultyLevel difficulty) {
        String difficultyStr = difficulty != null ? difficulty.name() : null;
        return jpaRepository.countByCondition(description, source, difficultyStr);
    }
    
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public void deleteAllById(List<Long> ids) {
        jpaRepository.deleteAllById(ids);
    }
}