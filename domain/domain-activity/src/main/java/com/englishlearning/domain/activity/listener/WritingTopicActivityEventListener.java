package com.englishlearning.domain.activity.listener;

import com.englishlearning.domain.activity.model.enums.ActivityType;
import com.englishlearning.domain.activity.service.UserActivityService;
import com.englishlearning.domain.content.event.WritingTopicCreatedEvent;
import com.englishlearning.domain.content.event.WritingTopicUpdatedEvent;
import com.englishlearning.domain.content.event.WritingTopicDeletedEvent;
import com.englishlearning.domain.content.event.WritingTopicBatchDeletedEvent;
import com.englishlearning.domain.content.model.entity.WritingTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 写作主题相关用户活动事件监听器
 * 基于Spring的事件监听机制，监听写作主题相关的领域事件，记录用户活动
 * 注意：目前ActivityType中没有直接的写作主题相关活动类型，此类为将来扩展预留
 */
@Component
@Profile("spring-event-handler")
public class WritingTopicActivityEventListener {

    private final UserActivityService userActivityService;

    @Autowired
    public WritingTopicActivityEventListener(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    /**
     * 监听写作主题创建事件
     * 注意：由于当前ActivityType中没有写作主题创建的活动类型，暂时使用ARTICLE_CREATED代替
     */
    @EventListener
    public void handleWritingTopicCreatedEvent(WritingTopicCreatedEvent event) {
        // 注意：这里使用ARTICLE_CREATED作为临时替代，将来应该添加专门的写作主题活动类型
        userActivityService.recordActivity(
            "system", // 由于事件中可能没有用户信息，使用system作为默认值
            "系统",
            ActivityType.ARTICLE_CREATED, // 临时使用ARTICLE_CREATED类型
            "创建写作主题：" + event.getWritingTopic().getDescription(),
            String.valueOf(event.getWritingTopic().getId()),
            "writingtopic"
        );
    }
    
    /**
     * 监听写作主题更新事件
     * 注意：由于当前ActivityType中没有写作主题更新的活动类型，暂时使用ARTICLE_UPDATED代替
     */
    @EventListener
    public void handleWritingTopicUpdatedEvent(WritingTopicUpdatedEvent event) {
        // 注意：这里使用ARTICLE_UPDATED作为临时替代，将来应该添加专门的写作主题活动类型
        userActivityService.recordActivity(
            "system", // 由于事件中可能没有用户信息，使用system作为默认值
            "系统",
            ActivityType.ARTICLE_UPDATED, // 临时使用ARTICLE_UPDATED类型
            "更新写作主题：" + event.getWritingTopic().getDescription(),
            String.valueOf(event.getWritingTopic().getId()),
            "writingtopic"
        );
    }
    
    /**
     * 监听写作主题删除事件
     * 注意：由于当前ActivityType中没有写作主题删除的活动类型，暂时使用ARTICLE_DELETED代替
     */
    @EventListener
    public void handleWritingTopicDeletedEvent(WritingTopicDeletedEvent event) {
        // 注意：这里使用ARTICLE_DELETED作为临时替代，将来应该添加专门的写作主题活动类型
        userActivityService.recordActivity(
            "system", // 由于事件中可能没有用户信息，使用system作为默认值
            "系统",
            ActivityType.ARTICLE_DELETED, // 临时使用ARTICLE_DELETED类型
            "删除写作主题",
            String.valueOf(event.getId()),
            "writingtopic"
        );
    }
    
    /**
     * 监听写作主题批量删除事件
     * 注意：由于当前ActivityType中没有写作主题批量删除的活动类型，暂时使用ARTICLE_BATCH_DELETED代替
     */
    @EventListener
    public void handleWritingTopicBatchDeletedEvent(WritingTopicBatchDeletedEvent event) {
        // 注意：这里使用ARTICLE_BATCH_DELETED作为临时替代，将来应该添加专门的写作主题活动类型
        List<Long> ids = event.getIds();
        String idsStr = ids.stream()
            .map(String::valueOf)
            .reduce((a, b) -> a + ", " + b)
            .orElse("");
            
        userActivityService.recordActivity(
            "system", // 由于事件中可能没有用户信息，使用system作为默认值
            "系统",
            ActivityType.ARTICLE_BATCH_DELETED, // 临时使用ARTICLE_BATCH_DELETED类型
            "批量删除写作主题",
            String.join(",", ids.stream().map(String::valueOf).toArray(String[]::new)),
            "writingtopic"
        );
    }
}