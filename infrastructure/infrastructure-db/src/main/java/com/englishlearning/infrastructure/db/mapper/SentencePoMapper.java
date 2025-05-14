package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.infrastructure.db.po.SentencePO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 句子PO映射接口
 */
@Mapper(componentModel = "spring", uses = {SentenceVariantPoMapper.class, WordPoMapper.class})
public interface SentencePoMapper {
    
    SentencePoMapper INSTANCE = Mappers.getMapper(SentencePoMapper.class);
    
    /**
     * PO转Entity
     */
    Sentence toEntity(SentencePO po);
    
    /**
     * Entity转PO
     */
    SentencePO toPo(Sentence entity);
    
    /**
     * PO List转Entity List
     */
    List<Sentence> toEntityList(List<SentencePO> poList);
    
    /**
     * Entity List转PO List
     */
    List<SentencePO> toPoList(List<Sentence> entityList);
} 