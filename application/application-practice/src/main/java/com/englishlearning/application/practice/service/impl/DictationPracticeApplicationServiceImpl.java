package com.englishlearning.application.practice.service.impl;

import com.englishlearning.application.practice.dto.DictationPracticeDTO;
import com.englishlearning.application.practice.dto.DictationPracticeQueryDTO;
import com.englishlearning.application.practice.service.DictationPracticeApplicationService;
import com.englishlearning.domain.practice.event.*;
import com.englishlearning.domain.practice.model.entity.DictationPractice;
import com.englishlearning.domain.practice.repository.DictationPracticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 听写练习应用服务实现类
 */
@Service
@RequiredArgsConstructor
public class DictationPracticeApplicationServiceImpl implements DictationPracticeApplicationService {
    
    private final DictationPracticeRepository dictationPracticeRepository;
    private final PracticeEventPublisher practiceEventPublisher;
    
    @Override
    @Transactional
    public DictationPracticeDTO create(DictationPracticeDTO dto, String userId, String username) {
        // 创建听写练习实体
        DictationPractice dictationPractice = DictationPractice.builder()
                .listenMaterialId(dto.getListenMaterialId())
                .content(dto.getContent())
                .userId(Long.valueOf(userId))
                .username(username)
                .build();
        
        // 调用领域方法
        dictationPractice.create();
        
        // 保存到仓储
        DictationPractice savedDictationPractice = dictationPracticeRepository.save(dictationPractice);
        
        // 发布领域事件
        DictationCreatedEvent event = new DictationCreatedEvent(userId, username, savedDictationPractice);
        practiceEventPublisher.publishDictationCreatedEvent(event);
        
        // 转换为DTO返回
        return convertToDTO(savedDictationPractice);
    }
    
    @Override
    @Transactional
    public DictationPracticeDTO update(DictationPracticeDTO dto, String userId, String username) {
        // 查找实体
        DictationPractice dictationPractice = dictationPracticeRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("听写练习不存在: " + dto.getId()));
        
        // 调用领域方法
        dictationPractice.update(dto.getContent());
        
        // 保存到仓储
        DictationPractice savedDictationPractice = dictationPracticeRepository.save(dictationPractice);
        
        // 发布领域事件
        DictationUpdatedEvent event = new DictationUpdatedEvent(userId, username, savedDictationPractice);
        practiceEventPublisher.publishDictationUpdatedEvent(event);
        
        // 转换为DTO返回
        return convertToDTO(savedDictationPractice);
    }
    
    @Override
    @Transactional
    public DictationPracticeDTO submit(Long id, String userId, String username) {
        // 查找实体
        DictationPractice dictationPractice = dictationPracticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("听写练习不存在: " + id));
        
        // 调用领域方法
        dictationPractice.submit();
        
        // 保存到仓储
        DictationPractice savedDictationPractice = dictationPracticeRepository.save(dictationPractice);
        
        // 发布领域事件
        DictationSubmittedEvent event = new DictationSubmittedEvent(userId, username, savedDictationPractice);
        practiceEventPublisher.publishDictationSubmittedEvent(event);
        
        // 转换为DTO返回
        return convertToDTO(savedDictationPractice);
    }
    
    @Override
    @Transactional
    public DictationPracticeDTO score(Long id, Integer score, String userId, String username) {
        // 查找实体
        DictationPractice dictationPractice = dictationPracticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("听写练习不存在: " + id));
        
        // 调用领域方法
        dictationPractice.score(score);
        
        // 保存到仓储
        DictationPractice savedDictationPractice = dictationPracticeRepository.save(dictationPractice);
        
        // 发布领域事件
        DictationScoredEvent event = new DictationScoredEvent(userId, username, savedDictationPractice);
        practiceEventPublisher.publishDictationScoredEvent(event);
        
        // 转换为DTO返回
        return convertToDTO(savedDictationPractice);
    }
    
    @Override
    public DictationPracticeDTO findById(Long id) {
        DictationPractice dictationPractice = dictationPracticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("听写练习不存在: " + id));
        return convertToDTO(dictationPractice);
    }
    
    @Override
    public List<DictationPracticeDTO> findByPage(DictationPracticeQueryDTO queryDTO) {
        List<DictationPractice> dictationPractices = dictationPracticeRepository.findByPage(
                queryDTO.getListenMaterialId(),
                queryDTO.getStatus(),
                queryDTO.getPageNum() != null ? queryDTO.getPageNum() : 1,
                queryDTO.getPageSize() != null ? queryDTO.getPageSize() : 10
        );
        
        return dictationPractices.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public long count(DictationPracticeQueryDTO queryDTO) {
        return dictationPracticeRepository.count(
                queryDTO.getListenMaterialId(),
                queryDTO.getStatus()
        );
    }
    
    @Override
    @Transactional
    public void deleteById(Long id, String userId, String username) {
        // 检查实体是否存在
        if (dictationPracticeRepository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("听写练习不存在: " + id);
        }
        
        // 删除实体
        dictationPracticeRepository.deleteById(id);
        
        // 发布领域事件
        DictationDeletedEvent event = new DictationDeletedEvent(userId, username, id);
        practiceEventPublisher.publishDictationDeletedEvent(event);
    }
    
    @Override
    @Transactional
    public void deleteByIds(List<Long> ids, String userId, String username) {
        // 批量删除实体
        dictationPracticeRepository.deleteByIdIn(ids);
        
        // 发布领域事件
        DictationBatchDeletedEvent event = new DictationBatchDeletedEvent(userId, username, ids);
        practiceEventPublisher.publishDictationBatchDeletedEvent(event);
    }
    
    /**
     * 将实体转换为DTO
     */
    private DictationPracticeDTO convertToDTO(DictationPractice dictationPractice) {
        return DictationPracticeDTO.builder()
                .id(dictationPractice.getId())
                .listenMaterialId(dictationPractice.getListenMaterialId())
                .status(dictationPractice.getStatus())
                .content(dictationPractice.getContent())
                .score(dictationPractice.getScore())
                .userId(dictationPractice.getUserId())
                .username(dictationPractice.getUsername())
                .createTime(dictationPractice.getCreateTime())
                .updateTime(dictationPractice.getUpdateTime())
                .build();
    }
}