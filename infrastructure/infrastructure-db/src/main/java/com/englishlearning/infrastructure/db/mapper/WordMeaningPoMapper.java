package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.infrastructure.db.po.WordMeaningPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 单词词义实体与PO转换器
 */
@Mapper(componentModel = "spring")
public interface WordMeaningPoMapper {
    
    WordMeaningPoMapper INSTANCE = Mappers.getMapper(WordMeaningPoMapper.class);
    
    /**
     * 将领域实体转换为PO
     */
    WordMeaningPO toPo(WordMeaning entity);
    
    /**
     * 将PO转换为领域实体
     */
    WordMeaning toEntity(WordMeaningPO po);
    
    /**
     * 批量将领域实体转换为PO
     */
    List<WordMeaningPO> toPoList(List<WordMeaning> entityList);
    
    /**
     * 批量将PO转换为领域实体
     */
    List<WordMeaning> toEntityList(List<WordMeaningPO> poList);
}