package com.englishlearning.application.content.service.impl;

import com.englishlearning.application.content.dto.WritingTopicDTO;
import com.englishlearning.application.content.mapper.WritingTopicMapper;
import com.englishlearning.application.content.service.WritingTopicApplicationService;
import com.englishlearning.common.types.PageRequest;
import com.englishlearning.domain.content.dto.CreateWritingTopicDTO;
import com.englishlearning.domain.content.dto.UpdateWritingTopicDTO;
import com.englishlearning.domain.content.event.WritingTopicEventPublisher;
import com.englishlearning.domain.content.model.entity.WritingTopic;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.domain.content.repository.WritingTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

/**
 * 写作主题应用服务实现类
 */
@Service
@RequiredArgsConstructor
public class WritingTopicApplicationServiceImpl implements WritingTopicApplicationService {
    
    private final WritingTopicRepository writingTopicRepository;
    private final WritingTopicMapper writingTopicMapper;
    private final WritingTopicEventPublisher eventPublisher;
    
    @Override
    @Transactional
    public WritingTopicDTO createWritingTopic(WritingTopicDTO writingTopicDTO) {
        // 转换为领域命令
        CreateWritingTopicDTO command = writingTopicMapper.toCreateCommand(writingTopicDTO);
        
        // 创建实体
        WritingTopic writingTopic = new WritingTopic();
        writingTopic.create(command);
        
        // 保存实体
        WritingTopic savedWritingTopic = writingTopicRepository.save(writingTopic);
        
        // 发布事件
        eventPublisher.publishWritingTopicCreatedEvent(savedWritingTopic);
        
        // 返回DTO
        return writingTopicMapper.toDTO(savedWritingTopic);
    }
    
    @Override
    @Transactional
    public WritingTopicDTO updateWritingTopic(WritingTopicDTO writingTopicDTO) {
        // 查找实体
        WritingTopic writingTopic = writingTopicRepository.findById(writingTopicDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("写作主题不存在: " + writingTopicDTO.getId()));
        
        // 转换为领域命令
        UpdateWritingTopicDTO command = writingTopicMapper.toUpdateCommand(writingTopicDTO);
        
        // 更新实体
        writingTopic.update(command);
        
        // 保存实体
        WritingTopic updatedWritingTopic = writingTopicRepository.save(writingTopic);
        
        // 发布事件
        eventPublisher.publishWritingTopicUpdatedEvent(updatedWritingTopic);
        
        // 返回DTO
        return writingTopicMapper.toDTO(updatedWritingTopic);
    }
    
    @Override
    public Optional<WritingTopicDTO> findWritingTopicById(Long id) {
        return writingTopicRepository.findById(id)
                .map(writingTopicMapper::toDTO);
    }
    
    @Override
    public List<WritingTopicDTO> findAllWritingTopics() {
        return writingTopicMapper.toDTOList(writingTopicRepository.findAll());
    }
    
    @Override
    public List<WritingTopicDTO> findWritingTopicsByPage(PageRequest pageRequest) {
        int pageNum = pageRequest.getPageNum();
        int pageSize = pageRequest.getPageSize();
        return writingTopicMapper.toDTOList(writingTopicRepository.findAll(pageNum, pageSize));
    }
    
    @Override
    public List<WritingTopicDTO> findWritingTopicsByCondition(String description, String source, String difficulty, PageRequest pageRequest) {
        int pageNum = pageRequest.getPageNum();
        int pageSize = pageRequest.getPageSize();
        
        // 转换难度级别
        DifficultyLevel difficultyLevel = null;
        if (StringUtils.hasText(difficulty)) {
            try {
                difficultyLevel = DifficultyLevel.fromCode(difficulty);
            } catch (IllegalArgumentException e) {
                // 忽略无效的难度级别
            }
        }
        
        return writingTopicMapper.toDTOList(
                writingTopicRepository.findByCondition(
                        description, source, difficultyLevel, pageNum, pageSize));
    }
    
    @Override
    public long countWritingTopics() {
        return writingTopicRepository.count();
    }
    
    @Override
    public long countWritingTopicsByCondition(String description, String source, String difficulty) {
        // 转换难度级别
        DifficultyLevel difficultyLevel = null;
        if (StringUtils.hasText(difficulty)) {
            try {
                difficultyLevel = DifficultyLevel.fromCode(difficulty);
            } catch (IllegalArgumentException e) {
                // 忽略无效的难度级别
            }
        }
        return writingTopicRepository.countByCondition(description, source, difficultyLevel);
    }
    
    @Override
    @Transactional
    public void deleteWritingTopic(Long id) {
        // 检查是否存在
        if (writingTopicRepository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("写作主题不存在: " + id);
        }
        
        // 删除实体
        writingTopicRepository.deleteById(id);
        
        // 发布事件
        eventPublisher.publishWritingTopicDeletedEvent(id);
    }
    
    @Override
    @Transactional
    public void batchDeleteWritingTopics(List<Long> ids) {
        // 删除实体
        writingTopicRepository.deleteAllById(ids);
        
        // 发布事件
        eventPublisher.publishWritingTopicBatchDeletedEvent(ids);
    }
}