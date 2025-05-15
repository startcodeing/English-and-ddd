package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.Word;
import com.englishlearning.infrastructure.db.po.WordPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 单词实体与PO转换器
 */
@Mapper(componentModel = "spring")
public interface WordPoMapper {
    
    WordPoMapper INSTANCE = Mappers.getMapper(WordPoMapper.class);
    
    /**
     * 将领域实体转换为PO
     */
    WordPO toPo(Word entity);
    
    /**
     * 将PO转换为领域实体
     */
    Word toEntity(WordPO po);
    
    /**
     * 批量将领域实体转换为PO
     */
    List<WordPO> toPoList(List<Word> entityList);
    
    /**
     * 批量将PO转换为领域实体
     */
    List<Word> toEntityList(List<WordPO> poList);
} 