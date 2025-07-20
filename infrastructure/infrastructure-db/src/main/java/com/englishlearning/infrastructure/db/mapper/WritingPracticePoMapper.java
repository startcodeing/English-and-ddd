package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.practice.model.entity.WritingPractice;
import com.englishlearning.infrastructure.db.po.WritingPracticePO;
import org.mapstruct.Mapper;

import java.util.List;

/**
 * 写作练习PO映射器
 */
@Mapper(componentModel = "spring")
public interface WritingPracticePoMapper {
    
    /**
     * 将领域实体转换为PO
     */
    WritingPracticePO toPo(WritingPractice entity);
    
    /**
     * 将PO转换为领域实体
     */
    WritingPractice toEntity(WritingPracticePO po);
    
    /**
     * 将PO列表转换为领域实体列表
     */
    List<WritingPractice> toEntityList(List<WritingPracticePO> poList);
}