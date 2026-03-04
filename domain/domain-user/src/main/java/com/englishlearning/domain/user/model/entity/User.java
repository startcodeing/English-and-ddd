package com.englishlearning.domain.user.model.entity;

import com.englishlearning.domain.user.model.enums.UserRole;
import com.englishlearning.domain.user.model.enums.UserStatus;
import com.englishlearning.domain.user.model.valueobject.Email;
import com.englishlearning.domain.user.model.valueobject.Password;
import com.englishlearning.domain.user.model.valueobject.UserId;
import com.englishlearning.domain.user.utils.SnowflakeIdGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * 用户实体（聚合根）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    /**
     * 用户ID（雪花算法生成）
     */
    @Id
    private Long id;

    /**
     * 用户名（唯一）
     */
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    /**
     * 邮箱（唯一）
     */
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    /**
     * 密码（BCrypt加密）
     */
    @Column(nullable = false)
    private String password;

    /**
     * 昵称
     */
    @Column(length = 50)
    private String nickname;

    /**
     * 头像URL
     */
    @Column(length = 500)
    private String avatarUrl;

    /**
     * 用户状态
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    /**
     * 用户角色集合
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role_name")
    @Builder.Default
    private Set<UserRole> roles = new HashSet<>();

    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginTime;

    /**
     * 创建时间戳
     */
    @Column(nullable = false)
    private Long createdAt;

    /**
     * 更新时间戳
     */
    @Column(nullable = false)
    private Long updatedAt;

    /**
     * 创建新用户（工厂方法）
     */
    public static User create(String username, String email, String password) {
        User user = new User();
        user.id = SnowflakeIdGenerator.getInstance().nextId();
        user.username = username;
        user.email = email;
        user.password = password; // 注意：这里需要调用方先加密
        user.status = UserStatus.ACTIVE;
        user.roles = new HashSet<>();
        user.roles.add(UserRole.ROLE_USER); // 默认角色
        user.createdAt = System.currentTimeMillis();
        user.updatedAt = System.currentTimeMillis();

        return user;
    }

    /**
     * 创建新用户（带昵称）
     */
    public static User create(String username, String email, String password, String nickname) {
        User user = create(username, email, password);
        user.nickname = nickname;
        return user;
    }

    /**
     * 更新用户信息
     */
    public void updateUserInfo(String nickname, String avatarUrl) {
        if (nickname != null && !nickname.trim().isEmpty()) {
            this.nickname = nickname;
        }
        if (avatarUrl != null && !avatarUrl.trim().isEmpty()) {
            this.avatarUrl = avatarUrl;
        }
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 更新密码
     */
    public void updatePassword(String newPassword) {
        Password passwordVo = new Password(newPassword);
        this.password = newPassword; // 注意：这里需要调用方先加密
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 添加角色
     */
    public void addRole(UserRole role) {
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        this.roles.add(role);
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 移除角色
     */
    public void removeRole(UserRole role) {
        if (this.roles != null) {
            this.roles.remove(role);
            this.updatedAt = System.currentTimeMillis();
        }
    }

    /**
     * 设置角色（替换所有角色）
     */
    public void setRoles(Set<UserRole> newRoles) {
        if (newRoles == null || newRoles.isEmpty()) {
            throw new IllegalArgumentException("User must have at least one role");
        }
        this.roles = new HashSet<>(newRoles);
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 更新最后登录时间
     */
    public void updateLastLoginTime() {
        this.lastLoginTime = LocalDateTime.now();
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 激活用户
     */
    public void activate() {
        this.status = UserStatus.ACTIVE;
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 停用用户
     */
    public void deactivate() {
        this.status = UserStatus.INACTIVE;
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 锁定用户
     */
    public void lock() {
        this.status = UserStatus.LOCKED;
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 解锁用户
     */
    public void unlock() {
        this.status = UserStatus.ACTIVE;
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * 检查用户是否有指定角色
     */
    public boolean hasRole(UserRole role) {
        return this.roles != null && this.roles.contains(role);
    }

    /**
     * 检查用户是否有任意指定角色之一
     */
    public boolean hasAnyRole(UserRole... roles) {
        if (this.roles == null || roles == null) {
            return false;
        }
        for (UserRole role : roles) {
            if (this.roles.contains(role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取用户ID值对象
     */
    public UserId getUserId() {
        return UserId.of(this.id);
    }

    /**
     * 检查用户是否处于活跃状态
     */
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }

    /**
     * 检查用户是否被锁定
     */
    public boolean isLocked() {
        return this.status == UserStatus.LOCKED;
    }
}
