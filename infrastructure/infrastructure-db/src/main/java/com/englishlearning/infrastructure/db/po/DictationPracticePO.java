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
 * 听写练习持久化对象
 */
@Data
@Entity
@Table(name = "t_dictation_practice")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class DictationPracticePO {
    
    /**
     * ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 关联的听力资料ID
     */
    @Column(name = "listen_material_id")
    private Long listenMaterialId;
    
    /**
     * 状态：draft-草稿，published-已提交
     */
    @Column(length = 20)
    private String status;
    
    /**
     * 听写内容
     */
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    
    /**
     * 得分
     */
    private Integer score;
    
    /**
     * 用户ID
     */
    @Column(name = "user_id")
    private Long userId;
    
    /**
     * 用户名
     */
    @Column(length = 50)
    private String username;
    
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