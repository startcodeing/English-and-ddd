package com.englishlearning.application.user.dto;

import com.englishlearning.domain.user.model.enums.UserRole;
import com.englishlearning.domain.user.model.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * 用户DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String nickname;
    private String avatarUrl;
    private UserStatus status;
    private Set<UserRole> roles;
    private LocalDateTime lastLoginTime;
    private Long createdAt;
    private Long updatedAt;
}
