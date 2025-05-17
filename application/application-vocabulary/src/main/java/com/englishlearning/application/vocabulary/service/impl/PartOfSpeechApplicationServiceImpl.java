package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.application.vocabulary.service.PartOfSpeechApplicationService;
import com.englishlearning.domain.vocabulary.command.CreatePartOfSpeechCommand;
import com.englishlearning.domain.vocabulary.command.DeletePartOfSpeechCommand;
import com.englishlearning.domain.vocabulary.command.PartOfSpeechCommandHandler;
import com.englishlearning.domain.vocabulary.command.UpdatePartOfSpeechCommand;
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
 */
@Service
public class PartOfSpeechApplicationServiceImpl implements PartOfSpeechApplicationService {


    private final PartOfSpeechCommandHandler partOfSpeechCommandHandler;
    private final PartOfSpeechRepository partOfSpeechRepository;

    @Autowired
    public PartOfSpeechApplicationServiceImpl(PartOfSpeechCommandHandler partOfSpeechCommandHandler,
                                              PartOfSpeechRepository partOfSpeechRepository) {
        this.partOfSpeechCommandHandler = partOfSpeechCommandHandler;
        this.partOfSpeechRepository = partOfSpeechRepository;
    }

    @Transactional
    @Override
    public PartOfSpeechDTO createPartOfSpeech(PartOfSpeechDTO dto) {
        try {
            CreatePartOfSpeechCommand addCommand = CreatePartOfSpeechCommand.builder()
                    .englishName(dto.getEnglishName())
                    .chineseMeaning(dto.getChineseMeaning())
                    .usageSummary(dto.getUsageSummary())
                    .commonPhrases(dto.getCommonPhrases())
                    .build();
            PartOfSpeech savedPartOfSpeech = partOfSpeechCommandHandler.handle(addCommand);
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
            UpdatePartOfSpeechCommand updateCommand = UpdatePartOfSpeechCommand.builder()
                    .englishName(dto.getEnglishName())
                    .chineseMeaning(dto.getChineseMeaning())
                    .usageSummary(dto.getUsageSummary())
                    .commonPhrases(dto.getCommonPhrases())
                    .id(dto.getId())
                    .build();
            PartOfSpeech updatedPartOfSpeech = partOfSpeechCommandHandler.handle(updateCommand);
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
            DeletePartOfSpeechCommand deleteCommand = DeletePartOfSpeechCommand.builder()
                    .id(id)
                    .build();
            partOfSpeechCommandHandler.handle(deleteCommand);
        } catch (Exception e) {
          throw new RuntimeException("删除词性失败: " + e.getMessage());
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
