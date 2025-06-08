package com.englishlearning.application.content.mapper.impl;

import com.englishlearning.application.content.dto.SentenceDTO;
import com.englishlearning.application.content.mapper.SentenceMapper;
import com.englishlearning.application.content.mapper.SentenceVariantMapper;
import com.englishlearning.domain.content.model.entity.Sentence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SentenceMapper的手动实现类
 * 临时解决MapStruct编译问题
 */
@Component
public class SentenceMapperImpl implements SentenceMapper {

    @Autowired
    private SentenceVariantMapper sentenceVariantMapper;

    @Override
    public SentenceDTO toDTO(Sentence entity) {
        if (entity == null) {
            return null;
        }

        return SentenceDTO.builder()
                .id(entity.getId())
                .englishContent(entity.getEnglishContent())
                .chineseMeaning(entity.getChineseMeaning())
                .grammarAnalysis(entity.getGrammarAnalysis())
                .variants(sentenceVariantMapper.toDTOList(entity.getVariants()))
                .unfamiliarWords(entity.getUnfamiliarWords())
                .build();
    }

    @Override
    public Sentence toEntity(SentenceDTO dto) {
        if (dto == null) {
            return null;
        }

        Sentence sentence = new Sentence();
        sentence.setId(dto.getId());
        sentence.setEnglishContent(dto.getEnglishContent());
        sentence.setChineseMeaning(dto.getChineseMeaning());
        sentence.setGrammarAnalysis(dto.getGrammarAnalysis());
        sentence.setVariants(sentenceVariantMapper.toEntityList(dto.getVariants()));
        sentence.setUnfamiliarWords(dto.getUnfamiliarWords());
        
        return sentence;
    }

    @Override
    public List<SentenceDTO> toDTOList(List<Sentence> entityList) {
        if (entityList == null) {
            return null;
        }

        return entityList.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<Sentence> toEntityList(List<SentenceDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }

        return dtoList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}