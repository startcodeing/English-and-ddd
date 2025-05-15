package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.WordBook;
import com.englishlearning.infrastructure.db.po.WordBookPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 单词本PO映射接口
 */
@Mapper(componentModel = "spring", uses = {WordPoMapper.class})
public interface WordBookPoMapper {
    
    WordBookPoMapper INSTANCE = Mappers.getMapper(WordBookPoMapper.class);
    
    /**
     * PO转Entity
     */
    WordBook toEntity(WordBookPO po);
    
    /**
     * Entity转PO
     */
    WordBookPO toPo(WordBook entity);
    
    /**
     * PO List转Entity List
     */
    List<WordBook> toEntityList(List<WordBookPO> poList);
    
    /**
     * Entity List转PO List
     */
    List<WordBookPO> toPoList(List<WordBook> entityList);
}