package com.englishlearning.application.user.service;

import com.englishlearning.application.user.dto.*;
import com.englishlearning.common.types.Result;
import com.englishlearning.domain.user.event.UserCreatedEvent;
import com.englishlearning.domain.user.event.UserLoggedInEvent;
import com.englishlearning.domain.user.model.entity.User;
import com.englishlearning.domain.user.model.enums.UserStatus;
import com.englishlearning.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * 认证应用服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationApplicationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final JwtTokenService jwtTokenService;

    /**
     * 用户注册
     */
    @Transactional
    public Result<LoginResponseDTO> register(RegisterRequestDTO request) {
        log.info("User registration attempt: username={}, email={}", request.getUsername(), request.getEmail());

        // 验证密码确认
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return Result.error("两次输入的密码不一致");
        }

        // 检查用户名是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            return Result.error("用户名已存在");
        }

        // 检查邮箱是否已存在
        if (userRepository.existsByEmail(request.getEmail())) {
            return Result.error("邮箱已被注册");
        }

        // 加密密码
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 创建用户
        User user = User.create(
            request.getUsername(),
            request.getEmail(),
            encodedPassword,
            request.getNickname() != null ? request.getNickname() : request.getUsername()
        );

        // 保存用户
        User savedUser = userRepository.save(user);

        // 发布用户创建事件
        eventPublisher.publishEvent(new UserCreatedEvent(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail()
        ));

        log.info("User registered successfully: userId={}, username={}", savedUser.getId(), savedUser.getUsername());

        // 生成令牌
        LoginResponseDTO response = jwtTokenService.generateTokens(savedUser);

        return Result.success(response);
    }

    /**
     * 用户登录
     */
    @Transactional
    public Result<LoginResponseDTO> login(LoginRequestDTO request, String ipAddress) {
        log.info("User login attempt: usernameOrEmail={}", request.getUsernameOrEmail());

        // 查找用户
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail())
            .orElse(null);

        if (user == null) {
            return Result.error("用户名或密码错误");
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return Result.error("用户名或密码错误");
        }

        // 检查用户状态
        if (user.getStatus() == UserStatus.LOCKED) {
            return Result.error("账号已被锁定，请联系管理员");
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            return Result.error("账号未激活，请先激活账号");
        }

        if (user.getStatus() == UserStatus.DELETED) {
            return Result.error("账号不存在");
        }

        // 更新最后登录时间
        user.updateLastLoginTime();
        userRepository.update(user);

        // 发布用户登录事件
        eventPublisher.publishEvent(new UserLoggedInEvent(
            user.getId(),
            user.getUsername(),
            ipAddress
        ));

        log.info("User logged in successfully: userId={}, username={}", user.getId(), user.getUsername());

        // 生成令牌
        LoginResponseDTO response = jwtTokenService.generateTokens(user);

        return Result.success(response);
    }

    /**
     * 刷新令牌
     */
    public Result<LoginResponseDTO> refreshToken(RefreshTokenRequestDTO request) {
        return jwtTokenService.refreshTokens(request.getRefreshToken());
    }

    /**
     * 登出
     */
    public Result<Void> logout(String token) {
        // 如果使用Redis存储令牌黑名单，在这里实现
        // 目前无状态JWT不主动失效，等待过期即可
        log.info("User logged out");
        return Result.success();
    }
}
