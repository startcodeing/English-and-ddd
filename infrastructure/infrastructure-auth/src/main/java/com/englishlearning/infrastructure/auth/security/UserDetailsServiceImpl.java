package com.englishlearning.infrastructure.auth.security;

import com.englishlearning.domain.user.model.entity.User;
import com.englishlearning.domain.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户详情服务实现
 * 从数据库加载用户信息
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        log.debug("Loading user by username or email: {}", usernameOrEmail);

        User user = userRepository.findByUsernameOrEmail(usernameOrEmail)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail)
            );

        log.debug("User found: {}", user.getUsername());

        return UserPrincipal.create(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getRoles()
        );
    }

    /**
     * 根据用户ID加载用户信息
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        log.debug("Loading user by ID: {}", id);

        User user = userRepository.findById(id)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found with id: " + id)
            );

        log.debug("User found: {}", user.getUsername());

        return UserPrincipal.create(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getRoles()
        );
    }
}
