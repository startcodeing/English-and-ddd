package com.englishlearning.domain.user.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * 角色实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 角色名称（唯一）
     * 例如：ROLE_ADMIN, ROLE_USER, ROLE_CONTENT_MANAGER
     */
    @Column(unique = true, nullable = false, length = 50)
    private String name;

    /**
     * 角色描述
     */
    @Column(length = 200)
    private String description;

    /**
     * 角色拥有的权限
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();

    /**
     * 添加权限
     */
    public void addPermission(Permission permission) {
        if (this.permissions == null) {
            this.permissions = new HashSet<>();
        }
        this.permissions.add(permission);
    }

    /**
     * 移除权限
     */
    public void removePermission(Permission permission) {
        if (this.permissions != null) {
            this.permissions.remove(permission);
        }
    }

    /**
     * 检查是否有指定权限
     */
    public boolean hasPermission(String permissionName) {
        return this.permissions != null &&
               this.permissions.stream()
                   .anyMatch(p -> p.getName().equals(permissionName));
    }
}
