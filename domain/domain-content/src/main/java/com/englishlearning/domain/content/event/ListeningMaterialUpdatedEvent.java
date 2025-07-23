package com.englishlearning.domain.content.event;

import com.englishlearning.domain.content.model.entity.ListeningMaterial;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 听力资料更新事件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListeningMaterialUpdatedEvent {
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 听力资料
     */
    private ListeningMaterial listeningMaterial;
}