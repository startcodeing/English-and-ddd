package com.englishlearning.domain.user.repository;

import com.englishlearning.domain.user.model.entity.User;
import com.englishlearning.domain.user.model.enums.UserRole;
import com.englishlearning.domain.user.model.enums.UserStatus;

import java.util.Optional;
import java.util.Set;

/**
 * 用户仓储接口
 */
public interface UserRepository {

    /**
     * 保存用户
     */
    User save(User user);

    /**
     * 根据ID查找用户
     */
    Optional<User> findById(Long id);

    /**
     * 根据用户名查找用户
     */
    Optional<User> findByUsername(String username);

    /**
     * 根据邮箱查找用户
     */
    Optional<User> findByEmail(String email);

    /**
     * 根据用户名或邮箱查找用户
     */
    Optional<User> findByUsernameOrEmail(String usernameOrEmail);

    /**
     * 检查用户名是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);

    /**
     * 更新用户
     */
    User update(User user);

    /**
     * 删除用户
     */
    void delete(User user);

    /**
     * 根据ID删除用户
     */
    void deleteById(Long id);

    /**
     * 查找所有用户（分页）
     */
    java.util.List<User> findAll(int page, int size);

    /**
     * 根据状态查找用户
     */
    java.util.List<User> findByStatus(UserStatus status);

    /**
     * 根据角色查找用户
     */
    java.util.List<User> findByRole(UserRole role);

    /**
     * 统计用户总数
     */
    long count();
}
