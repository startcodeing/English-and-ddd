package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.ListeningMaterial;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 听力资料批量删除事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListeningMaterialBatchDeletedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 被删除的听力资料ID列表
     */
    private List<String> listeningMaterialIds;
    
    /**
     * 被删除的听力资料列表
     */
    private List<ListeningMaterial> listeningMaterials;
}