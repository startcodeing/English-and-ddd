package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.WritingTopic;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.infrastructure.db.po.WritingTopicPO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

/**
 * 写作主题PO映射器
 */
@Mapper(componentModel = "spring")
public interface WritingTopicPoMapper {
    
    /**
     * 将领域实体转换为PO
     */
    @Mapping(source = "difficulty", target = "difficulty", qualifiedByName = "difficultyLevelToString")
    WritingTopicPO toPo(WritingTopic entity);
    
    /**
     * 将PO转换为领域实体
     */
    @Mapping(source = "difficulty", target = "difficulty", qualifiedByName = "stringToDifficultyLevel")
    WritingTopic toEntity(WritingTopicPO po);
    
    /**
     * 将PO列表转换为领域实体列表
     */
    List<WritingTopic> toEntityList(List<WritingTopicPO> poList);
    
    /**
     * 将难度级别枚举转换为字符串
     */
    @Named("difficultyLevelToString")
    default String difficultyLevelToString(DifficultyLevel difficultyLevel) {
        return difficultyLevel != null ? difficultyLevel.name() : null;
    }
    
    /**
     * 将字符串转换为难度级别枚举
     */
    @Named("stringToDifficultyLevel")
    default DifficultyLevel stringToDifficultyLevel(String difficulty) {
        return difficulty != null ? DifficultyLevel.valueOf(difficulty) : null;
    }
}