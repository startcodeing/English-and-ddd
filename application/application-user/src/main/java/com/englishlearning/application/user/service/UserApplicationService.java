package com.englishlearning.application.user.service;

import com.englishlearning.application.user.dto.ChangePasswordRequestDTO;
import com.englishlearning.application.user.dto.UpdateUserRequestDTO;
import com.englishlearning.application.user.dto.UserDTO;
import com.englishlearning.common.types.Result;
import com.englishlearning.domain.user.event.UserPasswordChangedEvent;
import com.englishlearning.domain.user.event.UserRolesUpdatedEvent;
import com.englishlearning.domain.user.model.entity.User;
import com.englishlearning.domain.user.model.enums.UserRole;
import com.englishlearning.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 用户应用服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserApplicationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 获取当前用户信息
     */
    public Result<UserDTO> getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        return Result.success(toDTO(user));
    }

    /**
     * 更新用户信息
     */
    @Transactional
    public Result<UserDTO> updateUser(Long userId, UpdateUserRequestDTO request) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        user.updateUserInfo(request.getNickname(), request.getAvatarUrl());
        User updatedUser = userRepository.update(user);

        log.info("User updated: userId={}", userId);

        return Result.success(toDTO(updatedUser));
    }

    /**
     * 修改密码
     */
    @Transactional
    public Result<Void> changePassword(Long userId, ChangePasswordRequestDTO request) {
        // 验证新密码确认
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return Result.error("两次输入的密码不一致");
        }

        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        // 验证旧密码
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return Result.error("旧密码错误");
        }

        // 更新密码
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.updatePassword(encodedNewPassword);
        userRepository.update(user);

        // 发布密码修改事件
        eventPublisher.publishEvent(new UserPasswordChangedEvent(
            user.getId(),
            user.getUsername()
        ));

        log.info("Password changed for user: userId={}", userId);

        return Result.success();
    }

    /**
     * 获取用户详情（管理员）
     */
    public Result<UserDTO> getUserById(Long userId) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        return Result.success(toDTO(user));
    }

    /**
     * 获取所有用户列表（管理员，分页）
     */
    public Result<List<UserDTO>> getAllUsers(int page, int size) {
        List<User> users = userRepository.findAll(page, size);

        List<UserDTO> userDTOs = users.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());

        return Result.success(userDTOs);
    }

    /**
     * 更新用户角色（管理员）
     */
    @Transactional
    public Result<Void> updateUserRoles(Long userId, Set<UserRole> newRoles) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        Set<UserRole> oldRoles = Set.copyOf(user.getRoles());
        user.setRoles(newRoles);
        userRepository.update(user);

        // 发布角色更新事件
        eventPublisher.publishEvent(new UserRolesUpdatedEvent(
            user.getId(),
            user.getUsername(),
            oldRoles,
            newRoles
        ));

        log.info("User roles updated: userId={}, roles={}", userId, newRoles);

        return Result.success();
    }

    /**
     * 激活用户（管理员）
     */
    @Transactional
    public Result<Void> activateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        user.activate();
        userRepository.update(user);

        log.info("User activated: userId={}", userId);

        return Result.success();
    }

    /**
     * 停用用户（管理员）
     */
    @Transactional
    public Result<Void> deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        user.deactivate();
        userRepository.update(user);

        log.info("User deactivated: userId={}", userId);

        return Result.success();
    }

    /**
     * 锁定用户（管理员）
     */
    @Transactional
    public Result<Void> lockUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        user.lock();
        userRepository.update(user);

        log.info("User locked: userId={}", userId);

        return Result.success();
    }

    /**
     * 解锁用户（管理员）
     */
    @Transactional
    public Result<Void> unlockUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        user.unlock();
        userRepository.update(user);

        log.info("User unlocked: userId={}", userId);

        return Result.success();
    }

    /**
     * 删除用户（管理员）
     */
    @Transactional
    public Result<Void> deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElse(null);

        if (user == null) {
            return Result.error("用户不存在");
        }

        userRepository.delete(user);

        log.info("User deleted: userId={}", userId);

        return Result.success();
    }

    /**
     * 转换为DTO
     */
    private UserDTO toDTO(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .nickname(user.getNickname())
            .avatarUrl(user.getAvatarUrl())
            .status(user.getStatus())
            .roles(user.getRoles())
            .lastLoginTime(user.getLastLoginTime())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}
