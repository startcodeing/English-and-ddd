package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.PartOfSpeech;
import com.englishlearning.infrastructure.db.po.PartOfSpeechPO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * 词性PO映射接口
 */
@Mapper(componentModel = "spring")
public interface PartOfSpeechPoMapper {


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

        String id = partOfSpeech.getId() != null ? partOfSpeech.getId() : null;
        List<String> commonPhraseList = Objects.isNull(partOfSpeech.getCommonPhrases())
                ? Collections.emptyList() : partOfSpeech.getCommonPhrasesList();

        return new PartOfSpeechPO(
                id,
                partOfSpeech.getEnglishName(),
                partOfSpeech.getChineseMeaning(),
                partOfSpeech.getUsageSummaryContent(),
                commonPhraseList
        );
    }

    /**
     * 将数据库实体转换为领域模型
     */
    default PartOfSpeech toEntity(PartOfSpeechPO po) {
        if (po == null) {
            return null;
        }

        String id = po.getId() != null ? po.getId() : null;

        return PartOfSpeech.reconstitute(
                id,
                po.getEnglishName(),
                po.getChineseMeaning(),
                po.getUsageSummary(),
                po.getCommonPhrases()
        );
    }
} 