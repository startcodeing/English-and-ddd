package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.SentenceVariant;
import com.englishlearning.infrastructure.db.po.SentenceVariantPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 句子变体PO映射接口
 */
@Mapper(componentModel = "spring")
public interface SentenceVariantPoMapper {
    
    SentenceVariantPoMapper INSTANCE = Mappers.getMapper(SentenceVariantPoMapper.class);
    
    /**
     * PO转Entity
     */
    SentenceVariant toEntity(SentenceVariantPO po);
    
    /**
     * Entity转PO
     */
    SentenceVariantPO toPo(SentenceVariant entity);
    
    /**
     * PO List转Entity List
     */
    List<SentenceVariant> toEntityList(List<SentenceVariantPO> poList);
    
    /**
     * Entity List转PO List
     */
    List<SentenceVariantPO> toPoList(List<SentenceVariant> entityList);
} 