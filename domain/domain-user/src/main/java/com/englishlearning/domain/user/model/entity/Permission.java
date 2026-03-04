package com.englishlearning.domain.user.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 权限实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 权限名称（唯一）
     * 例如：vocabulary:word:create, vocabulary:word:read
     */
    @Column(unique = true, nullable = false, length = 100)
    private String name;

    /**
     * 资源类型
     * 例如：vocabulary, content, practice, activity, user
     */
    @Column(nullable = false, length = 50)
    private String resource;

    /**
     * 操作类型
     * 例如：create, read, update, delete, manage
     */
    @Column(nullable = false, length = 50)
    private String action;

    /**
     * 权限描述
     */
    @Column(length = 200)
    private String description;

    @PrePersist
    protected void onCreate() {
        // 确保name格式为 resource:action
        if (name == null || name.trim().isEmpty()) {
            name = resource + ":" + action;
        }
    }
}
