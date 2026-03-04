package com.englishlearning.interfaces.user.controller;

import com.englishlearning.application.user.dto.ChangePasswordRequestDTO;
import com.englishlearning.application.user.dto.UpdateUserRequestDTO;
import com.englishlearning.application.user.dto.UserDTO;
import com.englishlearning.application.user.service.UserApplicationService;
import com.englishlearning.common.types.Result;
import com.englishlearning.common.utils.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 用户控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserApplicationService userApplicationService;

    /**
     * 获取当前用户信息
     * GET /api/user/me
     */
    @GetMapping("/me")
    public Result<UserDTO> getCurrentUser() {
        Long userId = UserContext.getCurrentUserId();
        log.info("Get current user info: userId={}", userId);

        return userApplicationService.getCurrentUser(userId);
    }

    /**
     * 更新当前用户信息
     * PUT /api/user/me
     */
    @PutMapping("/me")
    public Result<UserDTO> updateCurrentUser(@Valid @RequestBody UpdateUserRequestDTO request) {
        Long userId = UserContext.getCurrentUserId();
        log.info("Update current user info: userId={}", userId);

        return userApplicationService.updateUser(userId, request);
    }

    /**
     * 修改密码
     * PUT /api/user/password
     */
    @PutMapping("/password")
    public Result<Void> changePassword(@Valid @RequestBody ChangePasswordRequestDTO request) {
        Long userId = UserContext.getCurrentUserId();
        log.info("Change password: userId={}", userId);

        return userApplicationService.changePassword(userId, request);
    }
}
