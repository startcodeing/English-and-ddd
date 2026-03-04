package com.englishlearning.application.user.service;

import com.englishlearning.application.user.dto.LoginResponseDTO;
import com.englishlearning.common.types.Result;
import com.englishlearning.domain.user.model.entity.User;
import com.englishlearning.infrastructure.auth.security.JwtTokenProvider;
import org.springframework.stereotype.Service;

/**
 * JWT令牌服务
 */
@Service
public class JwtTokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    public JwtTokenService(JwtTokenProvider jwtTokenProvider,
                          RefreshTokenService refreshTokenService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
    }

    /**
     * 生成访问令牌和刷新令牌
     */
    public LoginResponseDTO generateTokens(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user);

        return LoginResponseDTO.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000) // 转换为秒
            .userInfo(LoginResponseDTO.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .roles(user.getRoles())
                .build())
            .build();
    }

    /**
     * 刷新令牌
     */
    public Result<LoginResponseDTO> refreshTokens(String refreshToken) {
        try {
            User user = refreshTokenService.verifyRefreshToken(refreshToken);
            String newAccessToken = jwtTokenProvider.generateAccessToken(user);

            return Result.success(LoginResponseDTO.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .build());
        } catch (Exception e) {
            return Result.error("刷新令牌无效或已过期");
        }
    }
}
