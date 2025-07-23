package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.VocabularyExampleSentence;
import com.englishlearning.infrastructure.db.po.VocabularyExampleSentencePO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 词汇例句实体与PO转换器
 */
@Mapper(componentModel = "spring")
public interface VocabularyExampleSentencePoMapper {

    /**
     * 将领域实体转换为PO
     */
    VocabularyExampleSentencePO toPo(VocabularyExampleSentence entity);
    
    /**
     * 将PO转换为领域实体
     */
    VocabularyExampleSentence toEntity(VocabularyExampleSentencePO po);
    
    /**
     * 批量将领域实体转换为PO
     */
    List<VocabularyExampleSentencePO> toPoList(List<VocabularyExampleSentence> entityList);
    
    /**
     * 批量将PO转换为领域实体
     */
    List<VocabularyExampleSentence> toEntityList(List<VocabularyExampleSentencePO> poList);
}