package com.englishlearning.interfaces.user.controller;

import com.englishlearning.application.user.dto.UserDTO;
import com.englishlearning.application.user.service.UserApplicationService;
import com.englishlearning.common.types.Result;
import com.englishlearning.domain.user.model.enums.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * 管理员用户控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserApplicationService userApplicationService;

    /**
     * 获取所有用户列表（分页）
     * GET /api/admin/users?page=0&size=20
     */
    @GetMapping
    public Result<List<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Get all users: page={}, size={}", page, size);

        return userApplicationService.getAllUsers(page, size);
    }

    /**
     * 获取指定用户信息
     * GET /api/admin/users/{id}
     */
    @GetMapping("/{id}")
    public Result<UserDTO> getUserById(@PathVariable Long id) {
        log.info("Get user by id: userId={}", id);

        return userApplicationService.getUserById(id);
    }

    /**
     * 更新用户角色
     * PUT /api/admin/users/{id}/roles
     */
    @PutMapping("/{id}/roles")
    public Result<Void> updateUserRoles(
            @PathVariable Long id,
            @RequestBody Set<UserRole> roles) {
        log.info("Update user roles: userId={}, roles={}", id, roles);

        return userApplicationService.updateUserRoles(id, roles);
    }

    /**
     * 激活用户
     * PUT /api/admin/users/{id}/activate
     */
    @PutMapping("/{id}/activate")
    public Result<Void> activateUser(@PathVariable Long id) {
        log.info("Activate user: userId={}", id);

        return userApplicationService.activateUser(id);
    }

    /**
     * 停用用户
     * PUT /api/admin/users/{id}/deactivate
     */
    @PutMapping("/{id}/deactivate")
    public Result<Void> deactivateUser(@PathVariable Long id) {
        log.info("Deactivate user: userId={}", id);

        return userApplicationService.deactivateUser(id);
    }

    /**
     * 锁定用户
     * PUT /api/admin/users/{id}/lock
     */
    @PutMapping("/{id}/lock")
    public Result<Void> lockUser(@PathVariable Long id) {
        log.info("Lock user: userId={}", id);

        return userApplicationService.lockUser(id);
    }

    /**
     * 解锁用户
     * PUT /api/admin/users/{id}/unlock
     */
    @PutMapping("/{id}/unlock")
    public Result<Void> unlockUser(@PathVariable Long id) {
        log.info("Unlock user: userId={}", id);

        return userApplicationService.unlockUser(id);
    }

    /**
     * 删除用户
     * DELETE /api/admin/users/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteUser(@PathVariable Long id) {
        log.info("Delete user: userId={}", id);

        return userApplicationService.deleteUser(id);
    }
}
