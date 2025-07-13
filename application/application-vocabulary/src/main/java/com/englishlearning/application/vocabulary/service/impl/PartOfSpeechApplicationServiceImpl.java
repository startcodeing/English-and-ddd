package com.englishlearning.application.vocabulary.service.impl;

import com.englishlearning.application.vocabulary.dto.CommonPhraseDTO;
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
        Optional<PartOfSpeech> existPartOfSpeech = partOfSpeechRepository.findByEnglishName(dto.getEnglishName());
        if (existPartOfSpeech.isPresent()) {
            throw new RuntimeException("Part of speech already exists");
        }
        CreatePartOfSpeechDTO createPartOfSpeechDTO = CreatePartOfSpeechDTO.builder()
                .englishName(dto.getEnglishName())
                .chineseMeaning(dto.getChineseMeaning())
                .usageSummary(dto.getUsageSummary())
                .commonPhrases(dto.getCommonPhrases())
                .build();

        PartOfSpeech partOfSpeech = PartOfSpeech.builder().build();
        partOfSpeech.create(createPartOfSpeechDTO);
        PartOfSpeech savedPartOfSpeech = partOfSpeechRepository.save(partOfSpeech);
        return convertToDTO(savedPartOfSpeech);
    }

    @Transactional
    @Override
    public PartOfSpeechDTO updatePartOfSpeech(String id,PartOfSpeechDTO dto) {
        UpdatePartOfSpeechDTO updatePartOfSpeechDTO = UpdatePartOfSpeechDTO.builder()
                .englishName(dto.getEnglishName())
                .chineseMeaning(dto.getChineseMeaning())
                .usageSummary(dto.getUsageSummary())
                .commonPhrases(dto.getCommonPhrases())
                .id(id)
                .build();
        updatePartOfSpeechDTO.validate();
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + updatePartOfSpeechDTO.getId()));

        partOfSpeech.update(updatePartOfSpeechDTO);
        PartOfSpeech updatedPartOfSpeech = partOfSpeechRepository.save(partOfSpeech);
        return convertToDTO(updatedPartOfSpeech);
    }

    @Transactional
    @Override
    public void deletePartOfSpeech(String id) {
        partOfSpeechRepository.deleteById(id);
    }
    
    @Transactional
    @Override
    public void batchDeletePartOfSpeech(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        partOfSpeechRepository.deleteAllById(ids);
    }


    @Override
    public void addCommonPhrase(CommonPhraseDTO commonPhraseDTO) {
        String partOfSpeechId = commonPhraseDTO.getPartOfSpeechId();
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(partOfSpeechId)
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + partOfSpeechId));
        partOfSpeech.addCommonPhrase(commonPhraseDTO.getPhrase());
        partOfSpeechRepository.save(partOfSpeech);
    }

    @Override
    public void removeCommonPhrase(CommonPhraseDTO commonPhraseDTO) {
        String partOfSpeechId = commonPhraseDTO.getPartOfSpeechId();
        PartOfSpeech partOfSpeech = partOfSpeechRepository.findById(partOfSpeechId)
                .orElseThrow(() -> new IllegalArgumentException("词性不存在: " + partOfSpeechId));
        partOfSpeech.removeCommonPhrase(commonPhraseDTO.getPhrase());
        partOfSpeechRepository.save(partOfSpeech);
    }

    @Override
    public PartOfSpeechDTO getPartOfSpeech(String id) {
        Optional<PartOfSpeech> optionalPartOfSpeech = partOfSpeechRepository.findById(id);
        return optionalPartOfSpeech.map(this::convertToDTO).orElse(null);
    }


    @Override
    public List<PartOfSpeechDTO> getAllPartOfSpeech() {
        List<PartOfSpeech> partOfSpeeches = partOfSpeechRepository.findAll();
        return partOfSpeeches.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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