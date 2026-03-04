package com.englishlearning.infrastructure.auth.security;

import com.englishlearning.common.utils.UserContext;
import com.englishlearning.domain.user.model.enums.UserRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 认证用户信息
 * 实现Spring Security的UserDetails接口
 */
public class UserPrincipal implements UserDetails, UserContext.UserPrincipal {

    private final Long id;
    private final String username;
    private final String email;
    private final String password;
    private final Set<UserRole> roles;
    private final Collection<? extends GrantedAuthority> authorities;

    private UserPrincipal(Long id, String username, String email, String password,
                         Set<UserRole> roles, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.authorities = authorities;
    }

    /**
     * 从User实体构建UserPrincipal
     */
    public static UserPrincipal create(Long id, String username, String email,
                                       String password, Set<UserRole> roles) {
        Collection<GrantedAuthority> authorities = roles.stream()
            .map(role -> new SimpleGrantedAuthority(role.name()))
            .collect(Collectors.toList());

        return new UserPrincipal(id, username, email, password, roles, authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Getters
    @Override
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Set<UserRole> getRoles() {
        return roles;
    }
}
