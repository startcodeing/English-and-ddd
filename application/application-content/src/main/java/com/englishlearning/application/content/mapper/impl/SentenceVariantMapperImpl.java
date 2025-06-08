package com.englishlearning.application.content.mapper.impl;

import com.englishlearning.application.content.dto.SentenceVariantDTO;
import com.englishlearning.application.content.mapper.SentenceVariantMapper;
import com.englishlearning.domain.content.model.entity.SentenceVariant;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SentenceVariantMapper的手动实现类
 * 临时解决MapStruct编译问题
 */
@Component
public class SentenceVariantMapperImpl implements SentenceVariantMapper {

    @Override
    public SentenceVariantDTO toDTO(SentenceVariant entity) {
        if (entity == null) {
            return null;
        }

        return SentenceVariantDTO.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .type(entity.getType())
                .description(entity.getDescription())
                .build();
    }

    @Override
    public SentenceVariant toEntity(SentenceVariantDTO dto) {
        if (dto == null) {
            return null;
        }

        SentenceVariant variant = new SentenceVariant();
        variant.setId(dto.getId());
        variant.setContent(dto.getContent());
        variant.setType(dto.getType());
        variant.setDescription(dto.getDescription());
        
        return variant;
    }

    @Override
    public List<SentenceVariantDTO> toDTOList(List<SentenceVariant> entityList) {
        if (entityList == null) {
            return null;
        }

        return entityList.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SentenceVariant> toEntityList(List<SentenceVariantDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }

        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}