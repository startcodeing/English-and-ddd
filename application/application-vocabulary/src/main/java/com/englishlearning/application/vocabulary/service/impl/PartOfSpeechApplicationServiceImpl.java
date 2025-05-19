package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.application.vocabulary.service.PartOfSpeechApplicationService;
import com.englishlearning.domain.vocabulary.command.CreatePartOfSpeechCommand;
import com.englishlearning.domain.vocabulary.command.DeletePartOfSpeechCommand;
import com.englishlearning.domain.vocabulary.command.UpdatePartOfSpeechCommand;
import com.englishlearning.domain.vocabulary.command.UpdatePartOfSpeechUsageSummaryCommand;
import com.englishlearning.domain.vocabulary.command.UpdatePartOfSpeechCommonPhrasesCommand;
import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.domain.vocabulary.repository.PartOfSpeechRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 词性应用服务实现类
 * 整合了命令处理器的功能，直接与仓储交互
 */
@Service
public class PartOfSpeechApplicationServiceImpl implements PartOfSpeechApplicationService {

    private final PartOfSpeechRepository partOfSpeechRepository;

    @Autowired
    public PartOfSpeechApplicationServiceImpl(PartOfSpeechRepository partOfSpeechRepository) {
        this.partOfSpeechRepository = partOfSpeechRepository;
    }

    @Transactional
    @Override
    public PartOfSpeechDTO createPartOfSpeech(PartOfSpeechDTO dto) {
        try {
            // 检查是否已存在相同英文名称的词性
            Optional<PartOfSpeech> existPartOfSpeech = partOfSpeechRepository.findByEnglishName(dto.getEnglishName());
            if (existPartOfSpeech.isPresent()) {
                throw new RuntimeException("Part of speech already exists");
            }
            
            // 创建命令对象
            CreatePartOfSpeechCommand createCommand = CreatePartOfSpeechCommand.builder()
                    .englishName(dto.getEnglishName())
                    .chineseMeaning(dto.getChineseMeaning())
                    .usageSummary(dto.getUsageSummary())
                    .commonPhrases(dto.getCommonPhrases())
                    .build();
            
            // 创建实体并执行领域逻辑
            PartOfSpeech partOfSpeech = PartOfSpeech.builder().build();
            partOfSpeech.create(createCommand);
            
            // 保存并返回
            PartOfSpeech savedPartOfSpeech = partOfSpeechRepository.save(partOfSpeech);
            return convertToDTO(savedPartOfSpeech);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("创建词性失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public PartOfSpeechDTO updatePartOfSpeech(PartOfSpeechDTO dto) {
        try {
            // 创建命令对象
            UpdatePartOfSpeechCommand updateCommand = UpdatePartOfSpeechCommand.builder()
                    .englishName(dto.getEnglishName())
                    .chineseMeaning(dto.getChineseMeaning())
                    .usageSummary(dto.getUsageSummary())
                    .commonPhrases(dto.getCommonPhrases())
                    .id(dto.getId())
                    .build();
            
            // 验证命令
            updateCommand.validate();
            
            // 获取实体
            PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(updateCommand.getId())
                    .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + updateCommand.getId()));
            
            // 执行更新逻辑
            partOfSpeech.update(updateCommand);
            
            // 保存并返回
            PartOfSpeech updatedPartOfSpeech = partOfSpeechRepository.save(partOfSpeech);
            return convertToDTO(updatedPartOfSpeech);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("更新词性失败: " + e.getMessage());
        }
    }

    @Override
    public PartOfSpeechDTO getPartOfSpeech(String id) {
        try {
            Optional<PartOfSpeech> optionalPartOfSpeech = partOfSpeechRepository.findById(id);
            return optionalPartOfSpeech.map(this::convertToDTO).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("获取词性失败: " + e.getMessage());
        }
    }

    @Override
    public List<PartOfSpeechDTO> getAllPartOfSpeech() {
        try {
            List<PartOfSpeech> partOfSpeeches = partOfSpeechRepository.findAll();
            return partOfSpeeches.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("获取所有词性失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public void deletePartOfSpeech(String id) {
        try {
            // 创建命令对象
            DeletePartOfSpeechCommand deleteCommand = DeletePartOfSpeechCommand.builder()
                    .id(id)
                    .build();
            
            // 验证命令
            deleteCommand.validate();
            
            // 直接删除
            partOfSpeechRepository.deleteById(deleteCommand.getId());
        } catch (Exception e) {
          throw new RuntimeException("删除词性失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新词性用法总结
     * @param command 更新词性用法总结命令
     * @return 更新后的词性DTO
     */
    @Transactional
    public PartOfSpeechDTO updatePartOfSpeechUsageSummary(UpdatePartOfSpeechUsageSummaryCommand command) {
        // 验证命令
        command.validate();
        
        // 获取实体
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + command.getId()));
        
        // 更新用法总结
        partOfSpeech.updateUsageSummary(command.getUsageSummary());
        
        // 保存并返回
        return convertToDTO(partOfSpeechRepository.save(partOfSpeech));
    }
    
    /**
     * 更新词性常用短语
     * @param command 更新词性常用短语命令
     * @return 更新后的词性DTO
     */
    @Transactional
    public PartOfSpeechDTO updatePartOfSpeechCommonPhrases(UpdatePartOfSpeechCommonPhrasesCommand command) {
        // 验证命令
        command.validate();
        
        // 获取实体
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + command.getId()));
        
        // 更新常用短语
        partOfSpeech.updateCommonPhrases(command.getCommonPhrases());
        
        // 保存并返回
        return convertToDTO(partOfSpeechRepository.save(partOfSpeech));
    }

    /**
     * 将实体转换为DTO
     */
    private PartOfSpeechDTO convertToDTO(PartOfSpeech partOfSpeech) {
        return PartOfSpeechDTO.builder()
                .id(partOfSpeech.getId())
                .englishName(partOfSpeech.getEnglishName())
                .chineseMeaning(partOfSpeech.getChineseMeaning())
                .usageSummary(partOfSpeech.getUsageSummaryContent())
                .commonPhrases(partOfSpeech.getCommonPhrasesList())
                .build();
    }
}