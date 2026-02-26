-- 英语学习平台MySQL数据库初始化脚本 (DDL)
-- English Learning Platform MySQL Database Initialization Script

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 创建数据库
-- ============================================================

CREATE DATABASE IF NOT EXISTS english_learning_platform
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE english_learning_platform;

-- ============================================================
-- 词汇和词性相关表
-- ============================================================

-- 词性表 (Parts of Speech)
CREATE TABLE IF NOT EXISTS parts_of_speech (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '词性ID',
    name VARCHAR(50) NOT NULL COMMENT '词性名称',
    description TEXT COMMENT '词性描述',
    examples TEXT COMMENT '示例',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_pos_name (name)
) COMMENT='词性表';

-- 词汇类别表 (Vocabulary Categories)
CREATE TABLE IF NOT EXISTS vocabulary_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '类别ID',
    name VARCHAR(50) NOT NULL COMMENT '类别名称',
    description TEXT COMMENT '类别描述',
    parent_id BIGINT COMMENT '父类别ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (parent_id) REFERENCES vocabulary_categories(id) ON DELETE SET NULL COMMENT '父类别外键',
    INDEX idx_vc_name (name),
    INDEX idx_vc_parent (parent_id)
) COMMENT='词汇类别表';

-- 词汇表 (Vocabulary Words)
CREATE TABLE IF NOT EXISTS vocabulary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '词汇ID',
    word VARCHAR(100) NOT NULL COMMENT '单词',
    pronunciation VARCHAR(200) COMMENT '发音',
    part_of_speech_id BIGINT COMMENT '词性ID',
    category_id BIGINT COMMENT '类别ID',
    definition TEXT COMMENT '定义',
    examples TEXT COMMENT '例句',
    synonyms TEXT COMMENT '同义词',
    antonyms TEXT COMMENT '反义词',
    frequency INT DEFAULT 0 COMMENT '词频',
    difficulty_level TINYINT DEFAULT 1 COMMENT '难度等级1-5',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (part_of_speech_id) REFERENCES parts_of_speech(id) ON DELETE SET NULL COMMENT '词性外键',
    FOREIGN KEY (category_id) REFERENCES vocabulary_categories(id) ON DELETE SET NULL COMMENT '类别外键',
    INDEX idx_vc_word (word),
    INDEX idx_vc_pos (part_of_speech_id),
    INDEX idx_vc_category (category_id),
    INDEX idx_vc_difficulty (difficulty_level)
) COMMENT='词汇表';

-- 单词本表 (Word Books)
CREATE TABLE IF NOT EXISTS word_books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '单词本ID',
    user_id VARCHAR(50) COMMENT '用户ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    description TEXT COMMENT '描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_wb_user (user_id)
) COMMENT='单词本表';

-- 单词本单词关联表
CREATE TABLE IF NOT EXISTS word_book_words (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '单词本单词ID',
    word_book_id BIGINT NOT NULL COMMENT '单词本ID',
    vocabulary_id BIGINT NOT NULL COMMENT '词汇ID',
    notes TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
    FOREIGN KEY (word_book_id) REFERENCES word_books(id) ON DELETE CASCADE COMMENT '单词本外键',
    FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE COMMENT '词汇外键',
    INDEX idx_wbw_wordbook (word_book_id),
    INDEX idx_wbw_vocabulary (vocabulary_id)
) COMMENT='单词本单词关联表';

-- ============================================================
-- 句子和文章相关表
-- ============================================================

-- 句子表 (Sentences)
CREATE TABLE IF NOT EXISTS sentences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '句子ID',
    sentence_en TEXT NOT NULL COMMENT '英文句子',
    sentence_cn TEXT COMMENT '中文翻译',
    difficulty_level TINYINT DEFAULT 1 COMMENT '难度等级1-5',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_st_difficulty (difficulty_level)
) COMMENT='句子表';

-- 句子语法分析表 (Sentence Grammar Analysis)
CREATE TABLE IF NOT EXISTS sentence_grammar_analysis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '语法分析ID',
    sentence_id BIGINT NOT NULL COMMENT '句子ID',
    analysis TEXT COMMENT '语法分析结果',
    tags TEXT COMMENT '语法标签',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (sentence_id) REFERENCES sentences(id) ON DELETE CASCADE COMMENT '句子外键',
    INDEX idx_sga_sentence (sentence_id)
) COMMENT='句子语法分析表';

-- 文章表 (Articles)
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '文章ID',
    title VARCHAR(200) NOT NULL COMMENT '文章标题',
    content TEXT COMMENT '文章内容',
    author VARCHAR(100) COMMENT '作者',
    source VARCHAR(200) COMMENT '出处',
    difficulty_level TINYINT DEFAULT 1 COMMENT '难度等级1-5',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_ar_difficulty (difficulty_level)
) COMMENT='文章表';

-- 句子文章关联表
CREATE TABLE IF NOT EXISTS article_sentences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '句子文章ID',
    article_id BIGINT NOT NULL COMMENT '文章ID',
    sentence_id BIGINT NOT NULL COMMENT '句子ID',
    sequence_number INT DEFAULT 1 COMMENT '序号',
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE COMMENT '文章外键',
    FOREIGN KEY (sentence_id) REFERENCES sentences(id) ON DELETE CASCADE COMMENT '句子外键',
    INDEX idx_as_article (article_id),
    INDEX idx_as_sentence (sentence_id)
) COMMENT='句子文章关联表';

-- ============================================================
-- 写作练习相关表
-- ============================================================

-- 写作主题表 (Writing Topics)
CREATE TABLE IF NOT EXISTS writing_topics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '写作主题ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    description TEXT COMMENT '描述',
    difficulty_level TINYINT DEFAULT 1 COMMENT '难度等级1-5',
    min_words INT DEFAULT 50 COMMENT '最少字数',
    max_words INT DEFAULT 200 COMMENT '最多字数',
    time_limit INT DEFAULT 1800 COMMENT '时间限制（秒）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_wt_difficulty (difficulty_level)
) COMMENT='写作主题表';

-- 写作练习表 (Writing Practices)
CREATE TABLE IF NOT EXISTS writing_practices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '写作练习ID',
    user_id VARCHAR(50) COMMENT '用户ID',
    writing_topic_id BIGINT NOT NULL COMMENT '写作主题ID',
    content TEXT COMMENT '写作内容',
    word_count INT DEFAULT 0 COMMENT '字数统计',
    time_spent INT DEFAULT 0 COMMENT '用时（秒）',
    score DECIMAL(5,2) DEFAULT 0.00 COMMENT '得分',
    status TINYINT DEFAULT 0 COMMENT '状态0-未提交1-已提交2-已评分',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (writing_topic_id) REFERENCES writing_topics(id) ON DELETE CASCADE COMMENT '写作主题外键',
    INDEX idx_wp_user (user_id),
    INDEX idx_wp_topic (writing_topic_id),
    INDEX idx_wp_status (status)
) COMMENT='写作练习表';

-- ============================================================
-- 语法分析相关表
-- ============================================================

-- 语法分析表 (Grammar Analysis)
CREATE TABLE IF NOT EXISTS grammar_analysis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '语法分析ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '语法内容Markdown)',
    category VARCHAR(50) COMMENT '语法分类',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_ga_category (category)
) COMMENT='语法分析表';

-- ============================================================
-- 听力资料和练习相关表
-- ============================================================

-- 听力资料表 (Listening Materials)
CREATE TABLE IF NOT EXISTS listening_materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '听力资料ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    description TEXT COMMENT '描述',
    audio_file_url VARCHAR(500) COMMENT '音频文件URL',
    audio_file_size BIGINT COMMENT '音频文件大小（字节）',
    duration INT COMMENT '时长（秒）',
    difficulty_level TINYINT DEFAULT 1 COMMENT '难度等级1-5',
    transcript TEXT COMMENT '原文',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_lm_difficulty (difficulty_level)
) COMMENT='听力资料表';

-- 听写练习表 (Dictation Practices)
CREATE TABLE IF NOT EXISTS dictation_practices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '听写练习ID',
    user_id VARCHAR(50) COMMENT '用户ID',
    listening_material_id BIGINT COMMENT '听力资料ID',
    dictation_text TEXT COMMENT '听写文本',
    correct_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT '正确率',
    time_spent INT DEFAULT 0 COMMENT '用时（秒）',
    status TINYINT DEFAULT 0 COMMENT '状态0-未开始1-进行中2-已完成',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (listening_material_id) REFERENCES listening_materials(id) ON DELETE SET NULL COMMENT '听力资料外键',
    INDEX idx_dp_user (user_id),
    INDEX idx_dp_material (listening_material_id),
    INDEX idx_dp_status (status)
) COMMENT='听写练习表';

-- ============================================================
-- 综合测试相关表
-- ============================================================

-- 综合测试表 (Comprehensive Tests)
CREATE TABLE IF NOT EXISTS comprehensive_tests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '综合测试ID',
    user_id VARCHAR(50) COMMENT '用户ID',
    test_type VARCHAR(50) COMMENT '测试类型',
    test_name VARCHAR(200) COMMENT '测试名称',
    test_config TEXT COMMENT '测试配置JSON)',
    score DECIMAL(5,2) DEFAULT 0.00 COMMENT '得分',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_ct_user (user_id),
    INDEX idx_ct_type (test_type)
) COMMENT='综合测试表';

-- 测试结果表 (Test Results)
CREATE TABLE IF NOT EXISTS test_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '测试结果ID',
    test_id BIGINT NOT NULL COMMENT '测试ID',
    question_id BIGINT COMMENT '题目ID',
    answer TEXT COMMENT '答案',
    correct_answer TEXT COMMENT '正确答案',
    is_correct BOOLEAN DEFAULT FALSE COMMENT '是否正确',
    score DECIMAL(5,2) DEFAULT 0.00 COMMENT '得分',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (test_id) REFERENCES comprehensive_tests(id) ON DELETE CASCADE COMMENT '测试外键',
    INDEX idx_tr_test (test_id),
    INDEX idx_tr_question (question_id),
    INDEX idx_tr_is_correct (is_correct)
) COMMENT='测试结果表';

-- ============================================================
-- 学习活动表
-- ============================================================

-- 用户活动表 (User Activities)
CREATE TABLE IF NOT EXISTS user_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户活动ID',
    user_id VARCHAR(50) COMMENT '用户ID',
    activity_type VARCHAR(50) COMMENT '活动类型',
    activity_content TEXT COMMENT '活动内容JSON)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_ua_user (user_id),
    INDEX idx_ua_type (activity_type),
    INDEX idx_ua_created (created_at)
) COMMENT='用户活动表';

-- ============================================================
-- 系统配置表
-- ============================================================

-- 系统配置表 (System Configuration)
CREATE TABLE IF NOT EXISTS system_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type VARCHAR(50) COMMENT '配置类型',
    description TEXT COMMENT '描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_sc_key (config_key)
) COMMENT='系统配置表';

-- ============================================================
-- 插入初始数据 (DML)
-- ============================================================

-- 插入词性初始数据
INSERT INTO parts_of_speech (name, description, examples) VALUES
('名词', 'Noun', '表示人、事、物、地点或抽象概念的词', 'apple, table, China'),
('动词', 'Verb', '表示动作或状态的词', 'eat, run, sleep'),
('形容词', 'Adjective', '修饰名词的词', 'beautiful, fast, heavy'),
('副词', 'Adverb', '修饰动词、形容词、副词的词', 'quickly, very, slowly'),
('代词', 'Pronoun', '代替名词的词', 'he, she, it, they'),
('介词', 'Preposition', '表示时间、地点、方向的词', 'in, on, at, to'),
('连词', 'Conjunction', '连接词、短语或从句的词', 'and, but, or, because'),
('冠词', 'Article', '放在名词前的词', 'a, an, the');

-- 插入词汇类别初始数据
INSERT INTO vocabulary_categories (name, description) VALUES
('基础词汇', '日常生活和工作中常用的基础词汇'),
('商务英语', '商务场景和职场中使用的专业词汇'),
('科技词汇', '科技、计算机、互联网相关词汇'),
('学术英语', '学术写作、研究、论文相关词汇'),
('旅游英语', '旅游、出行、住宿相关词汇');

-- 插入系统配置初始数据
INSERT INTO system_config (config_key, config_value, config_type, description) VALUES
('max_file_upload_size', '10485760', 'system', '最大文件上传大小（10MB)'),
('default_language', 'en', 'system', '默认语言'),
('default_difficulty_level', '3', 'system', '默认难度等级'),
('max_test_questions', '50', 'system', '最大测试题目数'),
('session_timeout', '1800', 'system', '会话超时时间（秒）'),
('supported_audio_formats', 'mp3,wav,m4a', 'system', '支持的音频格式');

-- 恢复外键约束检查
SET FOREIGN_KEY_CHECKS = 1;
