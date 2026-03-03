-- ============================================
-- 用户认证授权模块数据库表
-- 支持H2和MySQL
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY COMMENT '用户ID（雪花算法）',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT 'BCrypt加密密码',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE/INACTIVE/LOCKED/DELETED',
    last_login_time TIMESTAMP COMMENT '最后登录时间',
    created_at BIGINT NOT NULL COMMENT '创建时间戳',
    updated_at BIGINT NOT NULL COMMENT '更新时间戳'
);

-- 为H2数据库创建索引（H2使用COMMENT语法略有不同）
-- CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 角色表
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名：ROLE_ADMIN, ROLE_USER等',
    description VARCHAR(200) COMMENT '角色描述'
);

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL COMMENT '角色枚举值',
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 权限表（用于细粒度权限控制）
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '权限名：vocabulary:word:create',
    resource VARCHAR(50) NOT NULL COMMENT '资源：vocabulary',
    action VARCHAR(50) NOT NULL COMMENT '操作：create,read,update,delete',
    description VARCHAR(200) COMMENT '权限描述'
);

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 刷新令牌表
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE COMMENT '刷新令牌',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    expiry_date TIMESTAMP NOT NULL COMMENT '过期时间',
    created_at BIGINT NOT NULL COMMENT '创建时间戳',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- 密码重置令牌表
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE COMMENT '重置令牌（UUID）',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    expiry_date TIMESTAMP NOT NULL COMMENT '过期时间（通常1小时）',
    used BOOLEAN DEFAULT FALSE COMMENT '是否已使用',
    created_at BIGINT NOT NULL COMMENT '创建时间戳',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- ============================================
-- 初始化数据
-- ============================================

-- 插入默认角色
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', '系统管理员'),
('ROLE_CONTENT_MANAGER', '内容管理员'),
('ROLE_MODERATOR', '审核员'),
('ROLE_USER', '普通用户');

-- 插入默认权限（示例）
INSERT INTO permissions (name, resource, action, description) VALUES
('vocabulary:word:create', 'vocabulary', 'create', '创建单词'),
('vocabulary:word:read', 'vocabulary', 'read', '读取单词'),
('vocabulary:word:update', 'vocabulary', 'update', '更新单词'),
('vocabulary:word:delete', 'vocabulary', 'delete', '删除单词'),
('content:article:create', 'content', 'create', '创建文章'),
('content:article:read', 'content', 'read', '读取文章'),
('content:article:update', 'content', 'update', '更新文章'),
('content:article:delete', 'content', 'delete', '删除文章'),
('practice:dictation:create', 'practice', 'create', '创建听写练习'),
('practice:dictation:read', 'practice', 'read', '读取听写练习'),
('activity:user:read', 'activity', 'read', '读取用户活动'),
('user:manage', 'user', 'manage', '用户管理');

-- 为管理员角色分配所有权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'ROLE_ADMIN';

-- 为内容管理员分配词汇和内容相关权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'ROLE_CONTENT_MANAGER'
AND (p.resource = 'vocabulary' OR p.resource = 'content');

-- 为普通用户分配读取权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'ROLE_USER'
AND p.action = 'read';

-- 创建默认管理员用户（密码：admin123，需要在应用启动时加密）
-- 注意：这里的密码需要通过BCrypt加密后再插入
-- 临时使用：{bcrypt}前缀会让Spring Security自动识别
-- admin123的BCrypt加密结果：
-- $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH
INSERT INTO users (id, username, email, password, nickname, status, created_at, updated_at) VALUES
(1, 'admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '系统管理员', 'ACTIVE', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- 为管理员分配角色
INSERT INTO user_roles (user_id, role) VALUES
(1, 'ROLE_ADMIN');
