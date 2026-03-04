package com.englishlearning.infrastructure.auth.repository.impl;

import com.englishlearning.domain.user.model.entity.User;
import com.englishlearning.domain.user.model.enums.UserRole;
import com.englishlearning.domain.user.model.enums.UserStatus;
import com.englishlearning.domain.user.repository.UserRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * 用户仓储实现
 */
@Repository
public class UserRepositoryImpl implements UserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public User save(User user) {
        entityManager.persist(user);
        return user;
    }

    @Override
    public Optional<User> findById(Long id) {
        User user = entityManager.find(User.class, id);
        return Optional.ofNullable(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        List<User> users = entityManager.createQuery(
            "SELECT u FROM User u WHERE u.username = :username", User.class)
            .setParameter("username", username)
            .getResultList();

        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        List<User> users = entityManager.createQuery(
            "SELECT u FROM User u WHERE u.email = :email", User.class)
            .setParameter("email", email)
            .getResultList();

        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    @Override
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        List<User> users = entityManager.createQuery(
            "SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail", User.class)
            .setParameter("usernameOrEmail", usernameOrEmail)
            .getResultList();

        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    @Override
    public boolean existsByUsername(String username) {
        Long count = entityManager.createQuery(
            "SELECT COUNT(u) FROM User u WHERE u.username = :username", Long.class)
            .setParameter("username", username)
            .getSingleResult();

        return count > 0;
    }

    @Override
    public boolean existsByEmail(String email) {
        Long count = entityManager.createQuery(
            "SELECT COUNT(u) FROM User u WHERE u.email = :email", Long.class)
            .setParameter("email", email)
            .getSingleResult();

        return count > 0;
    }

    @Override
    @Transactional
    public User update(User user) {
        return entityManager.merge(user);
    }

    @Override
    @Transactional
    public void delete(User user) {
        if (entityManager.contains(user)) {
            entityManager.remove(user);
        } else {
            entityManager.remove(entityManager.merge(user));
        }
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        User user = findById(id).orElse(null);
        if (user != null) {
            delete(user);
        }
    }

    @Override
    public List<User> findAll(int page, int size) {
        return entityManager.createQuery(
            "SELECT u FROM User u ORDER BY u.createdAt DESC", User.class)
            .setFirstResult(page * size)
            .setMaxResults(size)
            .getResultList();
    }

    @Override
    public List<User> findByStatus(UserStatus status) {
        return entityManager.createQuery(
            "SELECT u FROM User u WHERE u.status = :status", User.class)
            .setParameter("status", status)
            .getResultList();
    }

    @Override
    public List<User> findByRole(UserRole role) {
        return entityManager.createQuery(
            "SELECT u FROM User u JOIN u.roles r WHERE r = :role", User.class)
            .setParameter("role", role)
            .getResultList();
    }

    @Override
    public long count() {
        return entityManager.createQuery(
            "SELECT COUNT(u) FROM User u", Long.class)
            .getSingleResult();
    }
}
