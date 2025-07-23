package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.content.event.ListeningMaterialCreatedEvent;
import com.englishlearning.domain.content.event.ListeningMaterialUpdatedEvent;
import com.englishlearning.domain.content.event.ListeningMaterialDeletedEvent;
import com.englishlearning.domain.content.event.ListeningMaterialBatchDeletedEvent;
import com.englishlearning.domain.content.model.entity.ListeningMaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * 听力资料相关用户活动事件监听器
 * 基于Spring的事件监听机制，监听听力资料相关的领域事件，记录用户活动
 */
@Component
@Profile("spring-event-handler")
public class ListeningMaterialActivityEventListener {

    private final UserActivityService userActivityService;

    @Autowired
    public ListeningMaterialActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    /**
     * 监听听力资料创建事件
     */
    @EventListener
    public void handleListeningMaterialCreatedEvent(ListeningMaterialCreatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.LISTENING_MATERIAL_CREATED,
            "创建听力资料：" + event.getListeningMaterial().getTitle(),
            String.valueOf(event.getListeningMaterial().getId()),
            "listening material"
        );
    }
    
    /**
     * 监听听力资料更新事件
     */
    @EventListener
    public void handleListeningMaterialUpdatedEvent(ListeningMaterialUpdatedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.LISTENING_MATERIAL_UPDATED,
            "更新听力资料：" + event.getListeningMaterial().getTitle(),
            String.valueOf(event.getListeningMaterial().getId()),
            "listeningmaterial"
        );
    }
    
    /**
     * 监听听力资料删除事件
     */
    @EventListener
    public void handleListeningMaterialDeletedEvent(ListeningMaterialDeletedEvent event) {
        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.LISTENING_MATERIAL_DELETED,
            "删除听力资料：" + event.getListeningMaterial().getTitle(),
            String.valueOf(event.getListeningMaterial().getId()),
            "listeningmaterial"
        );
    }
    
    /**
     * 监听听力资料批量删除事件
     */
    @EventListener
    public void handleListeningMaterialBatchDeletedEvent(ListeningMaterialBatchDeletedEvent event) {
        String materialTitles = event.getListeningMaterials().stream()
            .map(ListeningMaterial::getTitle)
            .collect(Collectors.joining(", "));

        userActivityService.recordActivity(
            event.getUserId(),
            event.getUsername(),
            ActivityType.LISTENING_MATERIAL_BATCH_DELETED,
            "批量删除听力资料：" + materialTitles,
            String.join(",", event.getListeningMaterialIds()),
            "listeningmaterial"
        );
    }
}