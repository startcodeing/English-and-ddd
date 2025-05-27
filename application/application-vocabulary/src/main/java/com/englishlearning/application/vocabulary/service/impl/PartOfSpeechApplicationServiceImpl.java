package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.application.vocabulary.service.PartOfSpeechApplicationService;
import com.englishlearning.domain.vocabulary.dto.CreatePartOfSpeechDTO;
import com.englishlearning.domain.vocabulary.dto.UpdatePartOfSpeechDTO;
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
            CreatePartOfSpeechDTO createCommand = CreatePartOfSpeechDTO.builder()
                    .englishName(dto.getEnglishName())
                    .chineseMeaning(dto.getChineseMeaning())
                    .usageSummary(dto.getUsageSummary())
                    .commonPhrases(dto.getCommonPhrases())
                    .build();
            
            PartOfSpeech partOfSpeech = PartOfSpeech.builder().build();
            partOfSpeech.create(createCommand);
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
            UpdatePartOfSpeechDTO updateCommand = UpdatePartOfSpeechDTO.builder()
                    .englishName(dto.getEnglishName())
                    .chineseMeaning(dto.getChineseMeaning())
                    .usageSummary(dto.getUsageSummary())
                    .commonPhrases(dto.getCommonPhrases())
                    .id(dto.getId())
                    .build();
            updateCommand.validate();
            PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(updateCommand.getId())
                    .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + updateCommand.getId()));
            partOfSpeech.update(updateCommand);
            PartOfSpeech updatedPartOfSpeech = partOfSpeechRepository.save(partOfSpeech);
            return convertToDTO(updatedPartOfSpeech);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("更新词性失败: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public void deletePartOfSpeech(String id) {
        try {
            // 直接删除
            partOfSpeechRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("删除词性失败: " + e.getMessage());
        }
    }


    @Override
    public void addCommonPhrase(String partOfSpeechId,String phrase) {
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(partOfSpeechId).orElseThrow(() -> new IllegalArgumentException("词性不存在: " + partOfSpeechId));
        partOfSpeech.addCommonPhrase(phrase);
        partOfSpeechRepository.save(partOfSpeech);
    }

    @Override
    public void removeCommonPhrase(String partOfSpeechId,String phrase) {
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(partOfSpeechId).orElseThrow(() -> new IllegalArgumentException("词性不存在: " + partOfSpeechId));
        partOfSpeech.removeCommonPhrase(phrase);
        partOfSpeechRepository.save(partOfSpeech);
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