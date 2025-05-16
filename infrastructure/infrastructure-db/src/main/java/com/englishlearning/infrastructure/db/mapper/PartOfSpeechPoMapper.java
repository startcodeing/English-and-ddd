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
    
//    /**
//     * PO转Entity
//     */
//    PartOfSpeech toEntity(PartOfSpeechPO po);
//
//    /**
//     * Entity转PO
//     */
//    PartOfSpeechPO toPo(PartOfSpeech entity);
    
    /**
     * PO List转Entity List
     */
    List<PartOfSpeech> toEntityList(List<PartOfSpeechPO> poList);
    
    /**
     * Entity List转PO List
     */
    List<PartOfSpeechPO> toPoList(List<PartOfSpeech> entityList);

    /**
     * 将领域模型转换为数据库实体
     */
    default PartOfSpeechPO toPo(PartOfSpeech partOfSpeech) {
        if (partOfSpeech == null) {
            return null;
        }

        Long id = partOfSpeech.getId() != null ? Long.valueOf(partOfSpeech.getId()) : null;

        return new PartOfSpeechPO(
                id,
                partOfSpeech.getEnglishName(),
                partOfSpeech.getChineseMeaning(),
                partOfSpeech.getUsageSummaryContent(),
                partOfSpeech.getCommonPhrasesList()
        );
    }

    /**
     * 将数据库实体转换为领域模型
     */
    default PartOfSpeech toEntity(PartOfSpeechPO po) {
        if (po == null) {
            return null;
        }

        String id = po.getId() != null ? po.getId().toString() : null;

        return PartOfSpeech.reconstitute(
                id,
                po.getEnglishName(),
                po.getChineseMeaning(),
                po.getUsageSummary(),
                po.getCommonPhrases()
        );
    }
} 