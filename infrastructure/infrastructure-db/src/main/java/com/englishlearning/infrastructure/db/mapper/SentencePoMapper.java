package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.Sentence;
import com.englishlearning.infrastructure.db.po.SentencePO;
import com.englishlearning.infrastructure.db.po.WordPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 句子PO映射接口
 */
@Mapper(componentModel = "spring", uses = {SentenceVariantPoMapper.class, WordPoMapper.class})
public interface SentencePoMapper {

    /**
     * PO转Entity
     */
    @Mapping(source = "unfamiliarWords",target = "unfamiliarWords")
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


    default List<String> mapWordPOListToIdList(List<WordPO> wordPOList) {
        if (wordPOList == null) {
            return Collections.emptyList();
        }
        return wordPOList.stream()
                .map(WordPO::getId)
                .collect(Collectors.toList());
    }

    default List<WordPO> mapIdListToWordPOList(List<String> ids) {
        if (ids == null){
            return Collections.emptyList();
        }
        return ids.stream()
                .map(id -> {
                    WordPO po = new WordPO();
                    po.setId(id);
                    return po;
                }).collect(Collectors.toList());
    }
} 