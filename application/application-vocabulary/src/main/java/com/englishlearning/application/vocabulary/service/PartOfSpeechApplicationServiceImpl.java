package com.englishlearning.application.vocabulary.service;

import com.englishlearning.application.vocabulary.dto.PartOfSpeechDTO;
import com.englishlearning.common.types.Result;
import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.domain.vocabulary.repository.PartOfSpeechRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 词性应用服务实现类
 */
@Service
public class PartOfSpeechApplicationServiceImpl implements PartOfSpeechApplicationService {

    private final PartOfSpeechRepository partOfSpeechRepository;

    @Autowired
    public PartOfSpeechApplicationServiceImpl(PartOfSpeechRepository partOfSpeechRepository) {
        this.partOfSpeechRepository = partOfSpeechRepository;
    }

    @Override
    public Result<PartOfSpeechDTO> createPartOfSpeech(PartOfSpeechDTO dto) {
        try {
            // 检查是否已存在相同英文名称的词性
            Optional<PartOfSpeech> existingPartOfSpeech = partOfSpeechRepository.findByEnglishName(dto.getEnglishName());
            if (existingPartOfSpeech.isPresent()) {
                return Result.failure("已存在相同英文名称的词性");
            }

            // 创建新的词性实体
            PartOfSpeech partOfSpeech = PartOfSpeech.builder()
                    .id(UUID.randomUUID().toString())
                    .englishName(dto.getEnglishName())
                    .chineseMeaning(dto.getChineseMeaning())
                    .usageSummary(dto.getUsageSummary())
                    .commonPhrases(dto.getCommonPhrases())
                    .build();

            // 保存到仓储
            PartOfSpeech savedPartOfSpeech = partOfSpeechRepository.save(partOfSpeech);

            // 转换为DTO并返回
            return Result.success(convertToDTO(savedPartOfSpeech));
        } catch (Exception e) {
            return Result.failure("创建词性失败: " + e.getMessage());
        }
    }

    @Override
    public Result<PartOfSpeechDTO> updatePartOfSpeech(String id, PartOfSpeechDTO dto) {
        try {
            // 查找要更新的词性
            Optional<PartOfSpeech> optionalPartOfSpeech = partOfSpeechRepository.findById(id);
            if (!optionalPartOfSpeech.isPresent()) {
                return Result.failure("未找到指定ID的词性");
            }

            // 检查是否存在相同英文名称但ID不同的词性
            Optional<PartOfSpeech> existingPartOfSpeech = partOfSpeechRepository.findByEnglishName(dto.getEnglishName());
            if (existingPartOfSpeech.isPresent() && !existingPartOfSpeech.get().getId().equals(id)) {
                return Result.failure("已存在相同英文名称的词性");
            }

            // 更新词性实体
            PartOfSpeech partOfSpeech = optionalPartOfSpeech.get();
            partOfSpeech.setEnglishName(dto.getEnglishName());
            partOfSpeech.setChineseMeaning(dto.getChineseMeaning());
            partOfSpeech.setUsageSummary(dto.getUsageSummary());
            partOfSpeech.setCommonPhrases(dto.getCommonPhrases());

            // 保存到仓储
            PartOfSpeech updatedPartOfSpeech = partOfSpeechRepository.save(partOfSpeech);

            // 转换为DTO并返回
            return Result.success(convertToDTO(updatedPartOfSpeech));
        } catch (Exception e) {
            return Result.failure("更新词性失败: " + e.getMessage());
        }
    }

    @Override
    public Result<PartOfSpeechDTO> getPartOfSpeech(String id) {
        try {
            // 查找词性
            Optional<PartOfSpeech> optionalPartOfSpeech = partOfSpeechRepository.findById(id);
            if (!optionalPartOfSpeech.isPresent()) {
                return Result.failure("未找到指定ID的词性");
            }

            // 转换为DTO并返回
            return Result.success(convertToDTO(optionalPartOfSpeech.get()));
        } catch (Exception e) {
            return Result.failure("获取词性失败: " + e.getMessage());
        }
    }

    @Override
    public Result<List<PartOfSpeechDTO>> getAllPartOfSpeech() {
        try {
            // 获取所有词性
            List<PartOfSpeech> partOfSpeeches = partOfSpeechRepository.findAll();

            // 转换为DTO列表并返回
            List<PartOfSpeechDTO> dtoList = partOfSpeeches.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return Result.success(dtoList);
        } catch (Exception e) {
            return Result.failure("获取所有词性失败: " + e.getMessage());
        }
    }

    @Override
    public Result<Void> deletePartOfSpeech(String id) {
        try {
            // 检查词性是否存在
            Optional<PartOfSpeech> optionalPartOfSpeech = partOfSpeechRepository.findById(id);
            if (!optionalPartOfSpeech.isPresent()) {
                return Result.failure("未找到指定ID的词性");
            }

            // 删除词性
            partOfSpeechRepository.deleteById(id);

            return Result.success();
        } catch (Exception e) {
            return Result.failure("删除词性失败: " + e.getMessage());
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
                .usageSummary(partOfSpeech.getUsageSummary())
                .commonPhrases(partOfSpeech.getCommonPhrases())
                .build();
    }
}
