package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.vocabulary.model.entity.WordMeaning;
import com.englishlearning.domain.vocabulary.model.entity.VocabularyExampleSentence;
import com.englishlearning.infrastructure.db.po.WordMeaningPO;
import com.englishlearning.infrastructure.db.po.WordMeaningSentencePO;
import com.englishlearning.infrastructure.db.po.WordMeaningSynonymPO;
import com.englishlearning.infrastructure.db.po.WordMeaningAntonymPO;
import com.englishlearning.infrastructure.db.po.VocabularyExampleSentencePO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 单词词义实体与PO转换器
 */
@Mapper(componentModel = "spring", uses = {VocabularyExampleSentencePoMapper.class})
public interface WordMeaningPoMapper {
    
    WordMeaningPoMapper INSTANCE = Mappers.getMapper(WordMeaningPoMapper.class);
    
    /**
     * 将领域实体转换为PO
     */
    @Mapping(target = "exampleSentences", source = "exampleSentences", qualifiedByName = "toSentencePOs")
    @Mapping(target = "synonyms", source = "synonymIds", qualifiedByName = "toSynonymPOs")
    @Mapping(target = "antonyms", source = "antonymIds", qualifiedByName = "toAntonymPOs")
    WordMeaningPO toPo(WordMeaning entity);
    
    /**
     * 将PO转换为领域实体
     */
    @Mapping(target = "exampleSentences", source = "exampleSentences", qualifiedByName = "toSentenceIds")
    @Mapping(target = "synonymIds", source = "synonyms", qualifiedByName = "toSynonymIds")
    @Mapping(target = "antonymIds", source = "antonyms", qualifiedByName = "toAntonymIds")
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
    default List<WordMeaningSentencePO> toSentencePOs(List<String> sentenceIds) {
        if (sentenceIds == null || sentenceIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        return sentenceIds.stream()
                .map(sentenceId -> WordMeaningSentencePO.builder()
                        .id(new WordMeaningSentencePO.WordMeaningSentenceId(null, sentenceId))
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
                .map(po -> po.getId().getSentenceId())
                .collect(Collectors.toList());
    }
    
    /**
     * 将同义词ID列表转换为同义词关联PO列表
     */
    @Named("toSynonymPOs")
    default List<WordMeaningSynonymPO> toSynonymPOs(List<String> synonymIds) {
        if (synonymIds == null || synonymIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        return synonymIds.stream()
                .map(synonymId -> WordMeaningSynonymPO.builder()
                        .id(new WordMeaningSynonymPO.WordMeaningSynonymId(null, synonymId))
                        .createdAt(System.currentTimeMillis())
                        .build())
                .collect(Collectors.toList());
    }
    
    /**
     * 将同义词关联PO列表转换为同义词ID列表
     */
    @Named("toSynonymIds")
    default List<String> toSynonymIds(List<WordMeaningSynonymPO> synonymPOs) {
        if (synonymPOs == null || synonymPOs.isEmpty()) {
            return new ArrayList<>();
        }
        
        return synonymPOs.stream()
                .map(po -> po.getId().getSynonymMeaningId())
                .collect(Collectors.toList());
    }
    
    /**
     * 将反义词ID列表转换为反义词关联PO列表
     */
    @Named("toAntonymPOs")
    default List<WordMeaningAntonymPO> toAntonymPOs(List<String> antonymIds) {
        if (antonymIds == null || antonymIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        return antonymIds.stream()
                .map(antonymId -> WordMeaningAntonymPO.builder()
                        .id(new WordMeaningAntonymPO.WordMeaningAntonymId(null, antonymId))
                        .createdAt(System.currentTimeMillis())
                        .build())
                .collect(Collectors.toList());
    }
    
    /**
     * 将反义词关联PO列表转换为反义词ID列表
     */
    @Named("toAntonymIds")
    default List<String> toAntonymIds(List<WordMeaningAntonymPO> antonymPOs) {
        if (antonymPOs == null || antonymPOs.isEmpty()) {
            return new ArrayList<>();
        }
        
        return antonymPOs.stream()
                .map(po -> po.getId().getAntonymMeaningId())
                .collect(Collectors.toList());
    }
}