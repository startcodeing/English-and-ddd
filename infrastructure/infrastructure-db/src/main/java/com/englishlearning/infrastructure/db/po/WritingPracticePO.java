package com.englishlearning.infrastructure.db.po;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 写作练习持久化对象
 */
@Data
@Entity
@Table(name = "t_writing_practice")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class WritingPracticePO {
    
    /**
     * ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 关联的写作主题ID
     */
    @Column(name = "topic_id")
    private Long topicId;
    
    /**
     * 状态：draft-草稿，published-已提交
     */
    @Column(length = 20)
    private String status;
    
    /**
     * 写作内容
     */
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    
    /**
     * 得分
     */
    private Integer score;
    
    /**
     * 创建时间
     */
    @CreatedDate
    @Column(name = "create_time")
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @LastModifiedDate
    @Column(name = "update_time")
    private LocalDateTime updateTime;
}