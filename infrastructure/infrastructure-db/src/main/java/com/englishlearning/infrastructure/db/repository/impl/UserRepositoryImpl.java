package com.englishlearning.infrastructure.db.repository.impl;

import com.englishlearning.domain.user.model.entity.User;
import com.englishlearning.domain.user.model.enums.UserRole;
import com.englishlearning.domain.user.model.enums.UserStatus;
import com.englishlearning.domain.user.repository.UserRepository;
import com.englishlearning.infrastructure.db.repository.jpa.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 用户仓储实现
 */
@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository jpaRepository;

    @Override
    public User save(User user) {
        return jpaRepository.save(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        return jpaRepository.findByUsernameOrEmail(usernameOrEmail);
    }

    @Override
    public boolean existsByUsername(String username) {
        return jpaRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public User update(User user) {
        return jpaRepository.save(user);
    }

    @Override
    public void delete(User user) {
        jpaRepository.delete(user);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public List<User> findAll(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return jpaRepository.findAll(pageRequest).getContent();
    }

    @Override
    public List<User> findByStatus(UserStatus status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public List<User> findByRole(UserRole role) {
        return jpaRepository.findByRole(role);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }
}
