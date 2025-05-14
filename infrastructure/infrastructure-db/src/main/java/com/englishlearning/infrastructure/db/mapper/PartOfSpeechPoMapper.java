package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.infrastructure.db.po.PartOfSpeechPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 词性PO映射接口
 */
@Mapper(componentModel = "spring")
public interface PartOfSpeechPoMapper {
    
    PartOfSpeechPoMapper INSTANCE = Mappers.getMapper(PartOfSpeechPoMapper.class);
    
    /**
     * PO转Entity
     */
    PartOfSpeech toEntity(PartOfSpeechPO po);
    
    /**
     * Entity转PO
     */
    PartOfSpeechPO toPo(PartOfSpeech entity);
    
    /**
     * PO List转Entity List
     */
    List<PartOfSpeech> toEntityList(List<PartOfSpeechPO> poList);
    
    /**
     * Entity List转PO List
     */
    List<PartOfSpeechPO> toPoList(List<PartOfSpeech> entityList);
} 