package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.model.valueobject.AntonymInfo;
import com.englishlearning.domain.vocabulary.model.valueobject.SynonymInfo;
import com.englishlearning.infrastructure.db.po.*;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 单词词义实体与PO转换器
 */
@Mapper(componentModel = "spring")
public interface WordMeaningPoMapper {

    /**
     * 将领域实体转换为PO
     */
    @Mapping(target = "exampleSentences",expression = "java(toSentencePOs(entity.getExampleSentenceIds(),entity.getId()))")
    @Mapping(target = "synonyms",expression = "java(toSynonymPOs(entity.getSynonymWordMeaningIds(),entity.getId()))" )
    @Mapping(target = "antonyms",expression = "java(toAntonymPOs(entity.getAntonymWordMeaningIds(),entity.getId()))")
    WordMeaningPO toPo(WordMeaning entity);
    
    /**
     * 将PO转换为领域实体
     */
    @Mapping(target = "exampleSentenceIds", source = "exampleSentences", qualifiedByName = "toSentenceIds")
    @Mapping(target = "synonymWordMeaningIds", source = "synonyms", qualifiedByName = "toSynonymIds")
    @Mapping(target = "antonymWordMeaningIds", source = "antonyms", qualifiedByName = "toAntonymIds")
    WordMeaning toEntity(WordMeaningPO po);
    
    /**
     * 批量将领域实体转换为PO
     */
    List<WordMeaningPO> toPoList(List<WordMeaning> entityList);
    
    /**
     * 批量将PO转换为领域实体
     */
    List<WordMeaning> toEntityList(List<WordMeaningPO> poList);
    
    /**
     * 将例句ID列表转换为例句关联PO列表
     */
    @Named("toSentencePOs")
    default List<WordMeaningSentencePO> toSentencePOs(List<String> sentenceIds, @Context String wordMeaningId) {
        if (sentenceIds == null || sentenceIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        return sentenceIds.stream()
                .map(sentenceId -> WordMeaningSentencePO.builder()
                        .wordMeaning(WordMeaningPO.builder().id(wordMeaningId).build())
                        .sentenceId(sentenceId)
                        .createdAt(System.currentTimeMillis())
                        .build())
                .collect(Collectors.toList());
    }
    
    /**
     * 将例句关联PO列表转换为例句ID列表
     */
    @Named("toSentenceIds")
    default List<String> toSentenceIds(List<WordMeaningSentencePO> sentencePOs) {
        if (sentencePOs == null || sentencePOs.isEmpty()) {
            return new ArrayList<>();
        }
        
        return sentencePOs.stream()
                .map(WordMeaningSentencePO::getSentenceId)
                .collect(Collectors.toList());
    }
    
    /**
     * 将同义词ID列表转换为同义词关联PO列表
     */
    @Named("toSynonymPOs")
    default List<WordMeaningSynonymPO> toSynonymPOs(List<String> synonymIds,@Context String wordMeaningId) {
        if (synonymIds == null || synonymIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        return synonymIds.stream()
                .map(synonymId -> WordMeaningSynonymPO.builder()
                        .synonymMeaningId(synonymId)
                        .wordMeaning(WordMeaningPO.builder().id(wordMeaningId).build())
                        .createdAt(System.currentTimeMillis())
                        .build())
                .collect(Collectors.toList());
    }
    
    /**
     * 将同义词关联PO列表转换为同义词ID列表
     */
    @Named("toSynonymIds")
    default List<SynonymInfo> toSynonymIds(List<WordMeaningSynonymPO> synonymPOs) {
        if (synonymPOs == null || synonymPOs.isEmpty()) {
            return new ArrayList<>();
        }

        return synonymPOs.stream()
                .map(po -> SynonymInfo.builder()
                        .synonymWordId(po.getSynonymWordId())
                        .synonymMeaningId(po.getSynonymMeaningId()).build())
                .collect(Collectors.toList());
    }
    
    /**
     * 将反义词ID列表转换为反义词关联PO列表
     */
    @Named("toAntonymPOs")
    default List<WordMeaningAntonymPO> toAntonymPOs(List<String> antonymIds,@Context String wordMeaningId) {
        if (antonymIds == null || antonymIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        return antonymIds.stream()
                .map(antonymId -> WordMeaningAntonymPO.builder()
                        .antonymMeaningId(antonymId)
                        .wordMeaning(WordMeaningPO.builder().id(wordMeaningId).build())
                        .createdAt(System.currentTimeMillis())
                        .build())
                .collect(Collectors.toList());
    }
    
    /**
     * 将反义词关联PO列表转换为反义词ID列表
     */
    @Named("toAntonymIds")
    default List<AntonymInfo> toAntonymIds(List<WordMeaningAntonymPO> antonymPOs) {
        if (antonymPOs == null || antonymPOs.isEmpty()) {
            return new ArrayList<>();
        }
        
        return antonymPOs.stream()
                .map(po -> AntonymInfo.builder()
                        .antonymWordId(po.getAntonymWordId())
                        .antonymMeaningId(po.getAntonymMeaningId()).build())
                .collect(Collectors.toList());
    }
}