package com.englishlearning.interfaces.user.controller;

import com.englishlearning.application.user.dto.*;
import com.englishlearning.application.user.service.AuthenticationApplicationService;
import com.englishlearning.common.types.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationApplicationService authenticationApplicationService;

    /**
     * 用户注册
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public Result<LoginResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        log.info("Registration request: username={}", request.getUsername());
        return authenticationApplicationService.register(request);
    }

    /**
     * 用户登录
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public Result<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request,
                                          HttpServletRequest httpRequest) {
        log.info("Login request: usernameOrEmail={}", request.getUsernameOrEmail());

        String ipAddress = getClientIp(httpRequest);
        return authenticationApplicationService.login(request, ipAddress);
    }

    /**
     * 刷新令牌
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public Result<LoginResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO request) {
        log.info("Token refresh request");
        return authenticationApplicationService.refreshToken(request);
    }

    /**
     * 登出
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public Result<Void> logout(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        log.info("Logout request");

        return authenticationApplicationService.logout(token);
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    /**
     * 从请求中提取令牌
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
