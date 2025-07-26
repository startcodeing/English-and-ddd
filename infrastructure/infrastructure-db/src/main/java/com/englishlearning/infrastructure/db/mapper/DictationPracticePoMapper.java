package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.practice.model.entity.DictationPractice;
import com.englishlearning.infrastructure.db.po.DictationPracticePO;
import org.mapstruct.Mapper;

import java.util.List;

/**
 * 听写练习实体与PO对象映射器
 */
@Mapper(componentModel = "spring")
public interface DictationPracticePoMapper {
    
    // Spring 管理的组件不需要静态实例
    
    /**
     * 实体转PO
     */
    DictationPracticePO toPO(DictationPractice dictationPractice);
    
    /**
     * PO转实体
     */
    DictationPractice toEntity(DictationPracticePO dictationPracticePO);
    
    /**
     * 实体列表转PO列表
     */
    List<DictationPracticePO> toPOList(List<DictationPractice> dictationPractices);
    
    /**
     * PO列表转实体列表
     */
    List<DictationPractice> toEntityList(List<DictationPracticePO> dictationPracticePOs);
}