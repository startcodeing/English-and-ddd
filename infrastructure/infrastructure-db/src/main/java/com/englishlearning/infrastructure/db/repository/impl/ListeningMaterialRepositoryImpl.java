package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.domain.content.model.entity.ListeningMaterial;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.domain.content.repository.ListeningMaterialRepository;
import com.englishlearning.infrastructure.db.mapper.ListeningMaterialPoMapper;
import com.englishlearning.infrastructure.db.repository.ListeningMaterialJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 听力资料仓储接口实现类
 */
@Repository
@RequiredArgsConstructor
public class ListeningMaterialRepositoryImpl implements ListeningMaterialRepository {
    
    private final ListeningMaterialJpaRepository jpaRepository;
    private final ListeningMaterialPoMapper mapper;
    
    @Override
    public ListeningMaterial save(ListeningMaterial listeningMaterial) {
        return mapper.toEntity(jpaRepository.save(mapper.toPo(listeningMaterial)));
    }
    
    @Override
    public Optional<ListeningMaterial> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toEntity);
    }
    
    @Override
    public List<ListeningMaterial> findByDifficulty(DifficultyLevel difficulty) {
        return mapper.toEntityList(jpaRepository.findByDifficulty(difficulty));
    }
    
    @Override
    public List<ListeningMaterial> findByPage(int pageNum, int pageSize) {
        // 页码从0开始
        return mapper.toEntityList(jpaRepository.findAll(PageRequest.of(pageNum - 1, pageSize)).getContent());
    }
    
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public List<ListeningMaterial> findByTitleContaining(String title) {
        return mapper.toEntityList(jpaRepository.findByTitleContaining(title));
    }
}