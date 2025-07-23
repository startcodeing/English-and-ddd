package com.englishlearning.application.practice.service.impl;

import com.englishlearning.application.practice.dto.WritingPracticeDTO;
import com.englishlearning.application.practice.dto.WritingPracticeQueryDTO;
import com.englishlearning.application.practice.service.WritingPracticeApplicationService;
import com.englishlearning.domain.practice.event.*;
import com.englishlearning.domain.practice.model.entity.WritingPractice;
import com.englishlearning.domain.practice.repository.WritingPracticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 写作练习应用服务实现类
 */
@Service
@RequiredArgsConstructor
public class WritingPracticeApplicationServiceImpl implements WritingPracticeApplicationService {
    
    private final WritingPracticeRepository writingPracticeRepository;
    private final PracticeEventPublisher practiceEventPublisher;
    
    @Override
    @Transactional
    public WritingPracticeDTO createWritingPractice(WritingPracticeDTO writingPracticeDTO) {
        // 创建领域实体
        WritingPractice writingPractice = new WritingPractice();
        BeanUtils.copyProperties(writingPracticeDTO, writingPractice);
        
        // 执行创建逻辑
        writingPractice.create();
        
        // 保存实体
        WritingPractice savedPractice = writingPracticeRepository.save(writingPractice);
        
        // 发布事件
        WritingCreatedEvent event = new WritingCreatedEvent();
        event.setUserId(writingPracticeDTO.getUserId());
        event.setUsername(writingPracticeDTO.getUsername());
        event.setWritingPractice(savedPractice);
        practiceEventPublisher.publishWritingCreatedEvent(event);
        
        // 转换为DTO返回
        WritingPracticeDTO resultDTO = new WritingPracticeDTO();
        BeanUtils.copyProperties(savedPractice, resultDTO);
        return resultDTO;
    }
    
    @Override
    @Transactional
    public WritingPracticeDTO updateWritingPractice(Long id, WritingPracticeDTO writingPracticeDTO) {
        // 查找实体
        WritingPractice writingPractice = writingPracticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("写作练习不存在: " + id));
        
        // 更新内容
        writingPractice.update(writingPracticeDTO.getContent());
        
        // 保存实体
        WritingPractice updatedPractice = writingPracticeRepository.save(writingPractice);
        
        // 发布事件
        WritingUpdatedEvent event = new WritingUpdatedEvent();
        event.setUserId(writingPracticeDTO.getUserId());
        event.setUsername(writingPracticeDTO.getUsername());
        event.setWritingPractice(updatedPractice);
        practiceEventPublisher.publishWritingUpdatedEvent(event);
        
        // 转换为DTO返回
        WritingPracticeDTO resultDTO = new WritingPracticeDTO();
        BeanUtils.copyProperties(updatedPractice, resultDTO);
        return resultDTO;
    }
    
    @Override
    @Transactional
    public WritingPracticeDTO submitWritingPractice(Long id, Long userId, String username) {
        // 查找实体
        WritingPractice writingPractice = writingPracticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("写作练习不存在: " + id));
        
        // 提交练习
        writingPractice.submit();
        
        // 保存实体
        WritingPractice submittedPractice = writingPracticeRepository.save(writingPractice);
        
        // 发布事件
        WritingSubmittedEvent event = new WritingSubmittedEvent();
        event.setUserId(userId);
        event.setUsername(username);
        event.setWritingPractice(submittedPractice);
        practiceEventPublisher.publishWritingSubmittedEvent(event);
        
        // 转换为DTO返回
        WritingPracticeDTO resultDTO = new WritingPracticeDTO();
        BeanUtils.copyProperties(submittedPractice, resultDTO);
        return resultDTO;
    }
    
    @Override
    @Transactional
    public WritingPracticeDTO scoreWritingPractice(Long id, Integer score, Long userId, String username) {
        // 查找实体
        WritingPractice writingPractice = writingPracticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("写作练习不存在: " + id));
        
        // 评分
        writingPractice.score(score);
        
        // 保存实体
        WritingPractice scoredPractice = writingPracticeRepository.save(writingPractice);
        
        // 发布事件
        WritingScoredEvent event = new WritingScoredEvent();
        event.setUserId(userId);
        event.setUsername(username);
        event.setWritingPractice(scoredPractice);
        event.setScore(score);
        practiceEventPublisher.publishWritingScoredEvent(event);
        
        // 转换为DTO返回
        WritingPracticeDTO resultDTO = new WritingPracticeDTO();
        BeanUtils.copyProperties(scoredPractice, resultDTO);
        return resultDTO;
    }
    
    @Override
    @Transactional(readOnly = true)
    public WritingPracticeDTO getWritingPracticeById(Long id) {
        // 查找实体
        WritingPractice writingPractice = writingPracticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("写作练习不存在: " + id));
        
        // 转换为DTO返回
        WritingPracticeDTO resultDTO = new WritingPracticeDTO();
        BeanUtils.copyProperties(writingPractice, resultDTO);
        return resultDTO;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WritingPracticeDTO> getWritingPracticesByPage(WritingPracticeQueryDTO queryDTO) {
        // 设置默认分页参数
        int pageNum = queryDTO.getPageNum() != null ? queryDTO.getPageNum() : 1;
        int pageSize = queryDTO.getPageSize() != null ? queryDTO.getPageSize() : 10;
        
        // 查询实体列表
        List<WritingPractice> practices = writingPracticeRepository.findByPage(
                queryDTO.getTopicId(),
                queryDTO.getStatus(),
                pageNum,
                pageSize);
        
        // 转换为DTO列表返回
        return practices.stream()
                .map(practice -> {
                    WritingPracticeDTO dto = new WritingPracticeDTO();
                    BeanUtils.copyProperties(practice, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countWritingPractices(WritingPracticeQueryDTO queryDTO) {
        // 统计数量
        return writingPracticeRepository.count(queryDTO.getTopicId(), queryDTO.getStatus());
    }
    
    @Override
    @Transactional
    public void deleteWritingPractice(Long id, Long userId, String username) {
        // 检查实体是否存在
        if (writingPracticeRepository.findById(id).isEmpty()) {
            throw new RuntimeException("写作练习不存在: " + id);
        }
        
        // 发布事件
        WritingDeletedEvent event = new WritingDeletedEvent();
        event.setUserId(userId);
        event.setUsername(username);
        event.setWritingPracticeId(id);
        practiceEventPublisher.publishWritingDeletedEvent(event);
        
        // 删除实体
        writingPracticeRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public void batchDeleteWritingPractices(List<Long> ids, Long userId, String username) {
        // 发布事件
        WritingBatchDeletedEvent event = new WritingBatchDeletedEvent();
        event.setUserId(userId);
        event.setUsername(username);
        event.setWritingPracticeIds(ids);
        practiceEventPublisher.publishWritingBatchDeletedEvent(event);
        
        // 批量删除实体
        writingPracticeRepository.deleteByIdIn(ids);
    }
}