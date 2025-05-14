package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.infrastructure.db.po.WordPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 单词PO映射接口
 */
@Mapper(componentModel = "spring", uses = {PartOfSpeechPoMapper.class})
public interface WordPoMapper {
    
    WordPoMapper INSTANCE = Mappers.getMapper(WordPoMapper.class);
    
    /**
     * PO转Entity
     */
    Word toEntity(WordPO po);
    
    /**
     * Entity转PO
     */
    WordPO toPo(Word entity);
    
    /**
     * PO List转Entity List
     */
    List<Word> toEntityList(List<WordPO> poList);
    
    /**
     * Entity List转PO List
     */
    List<WordPO> toPoList(List<Word> entityList);
} 