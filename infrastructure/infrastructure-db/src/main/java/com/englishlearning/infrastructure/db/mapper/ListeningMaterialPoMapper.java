package com.englishlearning.infrastructure.db.mapper;

import com.englishlearning.domain.content.model.entity.ListeningMaterial;
import com.englishlearning.domain.content.model.enums.DifficultyLevel;
import com.englishlearning.infrastructure.db.po.ListeningMaterialPO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 听力资料PO和实体之间的映射器
 */
@Component
public class ListeningMaterialPoMapper {
    
    /**
     * 将实体转换为PO
     *
     * @param entity 听力资料实体
     * @return 听力资料PO
     */
    public ListeningMaterialPO toPo(ListeningMaterial entity) {
        if (entity == null) {
            return null;
        }
        
        return ListeningMaterialPO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .originContent(entity.getOriginContent())
                .difficulty(DifficultyLevel.fromCode(entity.getDifficulty()))
                .audioPath(entity.getAudioPath())
                .originFileName(entity.getOriginFileName())
                .fileSize(entity.getFileSize())
                .durationInSeconds(entity.getDurationInSeconds())
                .createTime(entity.getCreateTime())
                .updateTime(entity.getUpdateTime())
                .build();
    }
    
    /**
     * 将PO转换为实体
     *
     * @param po 听力资料PO
     * @return 听力资料实体
     */
    public ListeningMaterial toEntity(ListeningMaterialPO po) {
        if (po == null) {
            return null;
        }
        
        return ListeningMaterial.builder()
                .id(po.getId())
                .title(po.getTitle())
                .originContent(po.getOriginContent())
                .difficulty(po.getDifficulty().getCode())
                .audioPath(po.getAudioPath())
                .originFileName(po.getOriginFileName())
                .fileSize(po.getFileSize())
                .durationInSeconds(po.getDurationInSeconds())
                .createTime(po.getCreateTime())
                .updateTime(po.getUpdateTime())
                .build();
    }
    
    /**
     * 将PO列表转换为实体列表
     *
     * @param poList 听力资料PO列表
     * @return 听力资料实体列表
     */
    public List<ListeningMaterial> toEntityList(List<ListeningMaterialPO> poList) {
        if (poList == null) {
            return null;
        }
        
        return poList.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}