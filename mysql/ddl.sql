-- English Learning Platform - MySQL DDL Script
-- 创建数据库、表、索引、外键约束

-- 创建数据库
CREATE DATABASE IF NOT EXISTS english_learning_platform
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE english_learning_platform;

-- ============================================================
-- 词汇模块
-- ============================================================

-- 词性表
CREATE TABLE IF NOT EXISTS part_of_speech (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '词性名称',
    abbreviation VARCHAR(10) UNIQUE COMMENT '词性缩写',
    description TEXT COMMENT '词性描述',
    example_en TEXT COMMENT '英文示例',
    example_zh TEXT COMMENT '中文示例',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_pos_deleted (deleted_at),
    INDEX idx_pos_name (name)
) COMMENT='词性表';

-- 单词表
CREATE TABLE IF NOT EXISTS word (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    spelling VARCHAR(100) NOT NULL COMMENT '拼写',
    meaning TEXT COMMENT '词义',
    part_of_speech_id BIGINT COMMENT '词性ID（外键关联）',
    phonetic VARCHAR(100) COMMENT '音标',
    frequency INT DEFAULT 0 COMMENT '出现频率',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner' COMMENT '难度级别',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_word_spelling (spelling),
    INDEX idx_word_difficulty (difficulty_level),
    INDEX idx_word_deleted (deleted_at),
    FOREIGN KEY (part_of_speech_id) REFERENCES part_of_speech(id) ON DELETE SET NULL
) COMMENT='单词表';

-- 单词本表
CREATE TABLE IF NOT EXISTS word_book (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '单词本名称',
    description TEXT COMMENT '单词本描述',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner' COMMENT '难度级别',
    user_id BIGINT COMMENT '用户ID（关联用户表）',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_word_user (user_id, deleted_at),
    INDEX idx_word_public (is_public, deleted_at)
) COMMENT='单词本表';

-- 单词本关联表（单词本包含的单词）
CREATE TABLE IF NOT EXISTS word_book_word (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    word_book_id BIGINT NOT NULL COMMENT '单词本ID',
    word_id BIGINT NOT NULL COMMENT '单词ID',
    notes TEXT COMMENT '备注',
    mastery_level ENUM('unknown', 'learning', 'mastered', 'review') DEFAULT 'unknown' COMMENT '掌握程度',
    next_review_date TIMESTAMP COMMENT '下次复习日期（间隔重复算法）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_word_book_word (word_book_id, word_id),
    INDEX idx_word_book_word_book (word_book_id),
    INDEX idx_word_book_word (word_id),
    INDEX idx_word_book_next_review (next_review_date),
    FOREIGN KEY (word_book_id) REFERENCES word_book(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES word(id) ON DELETE CASCADE
) COMMENT='单词本关联表';

-- ============================================================
-- 内容模块
-- ============================================================

-- 句子表
CREATE TABLE IF NOT EXISTS sentence (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    english_sentence TEXT NOT NULL COMMENT '英文句子',
    chinese_translation TEXT COMMENT '中文翻译',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner' COMMENT '难度级别',
    category VARCHAR(50) COMMENT '分类',
    tags VARCHAR(200) COMMENT '标签（逗号分隔）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    FULLTEXT INDEX idx_sentence_english (english_sentence),
    INDEX idx_sentence_difficulty (difficulty_level),
    INDEX idx_sentence_deleted (deleted_at)
) COMMENT='句子表';

-- 文章表
CREATE TABLE IF NOT EXISTS article (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '文章标题',
    content LONGTEXT NOT NULL COMMENT '文章内容',
    source VARCHAR(200) COMMENT '来源',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner' COMMENT '难度级别',
    reading_time_minutes INT COMMENT '预计阅读时间（分钟）',
    word_count INT DEFAULT 0 COMMENT '单词数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    FULLTEXT INDEX idx_article_content (title, content),
    INDEX idx_article_difficulty (difficulty_level),
    INDEX idx_article_deleted (deleted_at)
) COMMENT='文章表';

-- 写作主题表
CREATE TABLE IF NOT EXISTS writing_topic (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '主题标题',
    description TEXT COMMENT '主题描述',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner' COMMENT '难度级别',
    min_word_count INT COMMENT '最少字数',
    max_word_count INT COMMENT '最多字数',
    time_limit_minutes INT COMMENT '时间限制（分钟）',
    category VARCHAR(50) COMMENT '分类',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_writing_topic_difficulty (difficulty_level),
    INDEX idx_writing_topic_active (is_active, deleted_at)
) COMMENT='写作主题表';

-- 语法分析表
CREATE TABLE IF NOT EXISTS grammar_analysis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '语法专题标题',
    content LONGTEXT NOT NULL COMMENT '语法内容（Markdown）',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner' COMMENT '难度级别',
    category VARCHAR(50) COMMENT '分类',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    FULLTEXT INDEX idx_grammar_analysis_content (title, content),
    INDEX idx_grammar_analysis_difficulty (difficulty_level),
    INDEX idx_grammar_analysis_active (is_active, deleted_at)
) COMMENT='语法分析表';

-- 听力资料表
CREATE TABLE IF NOT EXISTS listening_material (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '听力资料标题',
    description TEXT COMMENT '描述',
    original_text TEXT COMMENT '原文',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner' COMMENT '难度级别',
    file_path VARCHAR(500) COMMENT '音频文件路径（本地或OSS）',
    file_name VARCHAR(100) COMMENT '文件名',
    file_size INT COMMENT '文件大小（字节）',
    duration_seconds INT COMMENT '音频时长（秒）',
    file_format VARCHAR(10) COMMENT '文件格式（mp3, wav, ogg等）',
    file_url VARCHAR(500) COMMENT '文件访问URL（如果上传到OSS）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_listening_material_difficulty (difficulty_level),
    INDEX idx_listening_material_deleted (deleted_at)
) COMMENT='听力资料表';

-- ============================================================
-- 活动和练习模块
-- ============================================================

-- 用户活动表
CREATE TABLE IF NOT EXISTS user_activity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID（关联用户表）',
    activity_type ENUM('login', 'logout', 'view_content', 'take_quiz', 'start_practice', 'complete_practice', 'save_result', 'update_word_book', 'add_note', 'delete_item', 'share_progress', 'review_word', 'update_progress', 'download_material', 'submit_writing', 'start_listening', 'complete_listening', 'start_writing', 'complete_writing', 'take_grammar_test', 'start_writing_practice', 'complete_writing_practice', 'start_dictation_practice', 'complete_dictation_practice', 'start_comprehension_practice', 'complete_comprehension_practice') COMMENT '活动类型',
    resource_type ENUM('word', 'sentence', 'article', 'word_book', 'listening_material', 'writing_topic', 'grammar_analysis', 'quiz', 'practice', 'note', 'result', 'progress', 'material', 'writing', 'listening', 'comprehension', 'dictation') COMMENT '资源类型',
    resource_id BIGINT COMMENT '资源ID（如单词ID、文章ID）',
    activity_value TEXT COMMENT '活动值（JSON格式存储）',
    duration_seconds INT COMMENT '活动持续时间（秒）',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT '用户代理',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_activity_user (user_id),
    INDEX idx_user_activity_type (activity_type),
    INDEX idx_user_activity_resource (resource_type, resource_id),
    INDEX idx_user_activity_created (created_at)
) COMMENT='用户活动表';

-- 听写练习表
CREATE TABLE IF NOT EXISTS dictation_practice (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID（关联用户表）',
    listening_material_id BIGINT NOT NULL COMMENT '听力资料ID',
    practice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '练习日期',
    duration_seconds INT COMMENT '练习时长（秒）',
    total_words INT DEFAULT 0 COMMENT '总单词数',
    correct_words INT DEFAULT 0 COMMENT '正确单词数',
    accuracy_rate DECIMAL(5,2) COMMENT '正确率',
    user_answer TEXT COMMENT '用户答案（JSON格式存储）',
    result_summary TEXT COMMENT '结果总结',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_dictation_user (user_id, created_at),
    INDEX idx_dictation_material (listening_material_id),
    INDEX idx_dictation_deleted (deleted_at),
    FOREIGN KEY (listening_material_id) REFERENCES listening_material(id) ON DELETE SET NULL
) COMMENT='听写练习表';

-- 写作练习表
CREATE TABLE IF NOT EXISTS writing_practice (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID（关联用户表）',
    writing_topic_id BIGINT NOT NULL COMMENT '写作主题ID',
    practice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '练习日期',
    duration_seconds INT COMMENT '练习时长（秒）',
    word_count INT COMMENT '单词数量',
    user_writing TEXT COMMENT '用户写作内容',
    result_summary TEXT COMMENT '结果总结（JSON格式存储）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_writing_user (user_id, created_at),
    INDEX idx_writing_topic (writing_topic_id),
    INDEX idx_writing_deleted (deleted_at),
    FOREIGN KEY (writing_topic_id) REFERENCES writing_topic(id) ON DELETE SET NULL
) COMMENT='写作练习表';

-- 综合测试表
CREATE TABLE IF NOT EXISTS quiz (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID（关联用户表）',
    quiz_type ENUM('vocabulary', 'listening', 'writing', 'reading', 'comprehension', 'grammar', 'mixed') COMMENT '测试类型',
    quiz_source_type ENUM('word_book', 'article', 'sentence', 'writing_topic', 'listening_material', 'grammar_analysis', 'mixed') COMMENT '测试来源类型',
    quiz_source_id BIGINT COMMENT '测试来源ID（如单词本ID、文章ID）',
    quiz_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '测试日期',
    duration_seconds INT COMMENT '测试时长（秒）',
    total_questions INT COMMENT '总题数',
    correct_answers INT COMMENT '正确答案数',
    accuracy_rate DECIMAL(5,2) COMMENT '正确率',
    result_summary TEXT COMMENT '结果总结（JSON格式存储）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_quiz_user (user_id, created_at),
    INDEX idx_quiz_type (quiz_type),
    INDEX idx_quiz_source (quiz_source_type, quiz_source_id),
    INDEX idx_quiz_deleted (deleted_at)
) COMMENT='综合测试表';

-- ============================================================
-- 文件管理模块
-- ============================================================

-- 上传文件表
CREATE TABLE IF NOT EXISTS upload_file (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
    stored_name VARCHAR(255) NOT NULL COMMENT '存储文件名',
    file_path VARCHAR(500) COMMENT '文件路径',
    file_size INT COMMENT '文件大小（字节）',
    file_type VARCHAR(50) COMMENT '文件类型',
    file_format VARCHAR(10) COMMENT '文件格式',
    mime_type VARCHAR(100) COMMENT 'MIME类型',
    upload_type ENUM('listening_audio', 'user_avatar', 'practice_result', 'other') COMMENT '上传类型',
    upload_source ENUM('local', 'oss_s3', 'oss_minio', 'oss_azure', 'oss_gcp') COMMENT '上传来源',
    oss_url VARCHAR(500) COMMENT 'OSS访问URL',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间戳',
    INDEX idx_upload_file_type (upload_type),
    INDEX idx_upload_file_source (upload_source),
    INDEX idx_upload_file_active (is_active, deleted_at)
) COMMENT='上传文件表';

-- ============================================================
-- 外键约束和索引
-- ============================================================

-- 外键约束
ALTER TABLE word ADD CONSTRAINT fk_word_part_of_speech
    FOREIGN KEY (part_of_speech_id) REFERENCES part_of_speech(id)
    ON DELETE SET NULL;

ALTER TABLE word_book_word ADD CONSTRAINT fk_word_book_word_book
    FOREIGN KEY (word_book_id) REFERENCES word_book(id)
    ON DELETE CASCADE;

ALTER TABLE word_book_word ADD CONSTRAINT fk_word_book_word_word
    FOREIGN KEY (word_id) REFERENCES word(id)
    ON DELETE CASCADE;

ALTER TABLE dictation_practice ADD CONSTRAINT fk_dictation_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE;

ALTER TABLE writing_practice ADD CONSTRAINT fk_writing_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE;

ALTER TABLE writing_practice ADD CONSTRAINT fk_writing_topic
    FOREIGN KEY (writing_topic_id) REFERENCES writing_topic(id)
    ON DELETE SET NULL;

ALTER TABLE quiz ADD CONSTRAINT fk_quiz_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE;

-- ============================================================
-- 数据完整性检查
-- ============================================================

-- 启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 完成DDL脚本
SELECT 'DDL script executed successfully' AS result;

-- 显示数据库信息
SELECT DATABASE() AS current_database,
       VERSION() AS mysql_version,
       NOW() AS current_time;
