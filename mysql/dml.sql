-- English Learning Platform - MySQL DML Script
-- 插入初始数据（词性、示例内容、测试数据等）

-- 使用数据库
USE english_learning_platform;

-- ============================================================
-- 词汇模块初始数据
-- ============================================================

-- 插入词性数据
INSERT INTO part_of_speech (name, abbreviation, description, example_en, example_zh) VALUES
('名词', 'N', '表示人、事物、地点或抽象概念', 'The cat is on the table.', '猫在桌子上。'),
('动词', 'V', '表示动作或状态', 'The cat jumps over the table.', '猫跳过桌子。'),
('形容词', 'Adj', '修饰名词，提供额外信息', 'The big cat is on the table.', '大猫在桌子上。'),
('副词', 'Adv', '修饰动词、形容词或其他副词', 'The cat runs quickly.', '猫跑得快。'),
('代词', 'Pron', '代替名词或名词短语', 'The cat is on the table. It is black.', '猫在桌子上。它是黑色的。'),
('介词', 'Prep', '表示名词与其他词的关系', 'The cat is on the table.', '猫在桌子上。'),
('连词', 'Conj', '连接单词、短语或从句', 'The cat is on the table and jumps.', '猫在桌子上并且跳跃。'),
('感叹词', 'Interj', '表示情感或突然的喊叫', 'Oh! The cat is on the table!', '哦！猫在桌子上！'),
('冠词', 'Art', '位于名词之前，表示特定或泛指', 'The cat is on the table.', '猫在桌子上。');

-- 插入单词数据（名词）
INSERT INTO word (spelling, meaning, part_of_speech_id, phonetic, frequency, difficulty_level) VALUES
('cat', '一种小型毛茸茸的动物，常作为宠物饲养，善于捕鼠', 1, 1000, 'beginner'),
('table', '家具的一种，有平面顶板和支腿，通常由木头或金属制成', 1, 800, 'beginner'),
('book', '纸张或其他材料制成的书页，上面有文字或图片', 1, 950, 'beginner'),
('computer', '电子设备，能执行算术、逻辑和控制操作', 1, 1200, 'beginner'),
('phone', '一种电子设备，用于进行语音通话', 1, 1100, 'beginner'),
('car', '一种四轮汽车，通常由引擎驱动', 1, 1300, 'beginner'),
('house', '供人居住的建筑物', 1, 700, 'beginner'),
('tree', '一种大型植物，有树干、树枝和叶子', 1, 600, 'beginner'),
('water', '无色、无味的液体，对生物体至关重要', 1, 1500, 'beginner');

-- 插入单词数据（动词）
INSERT INTO word (spelling, meaning, part_of_speech_id, phonetic, frequency, difficulty_level) VALUES
('run', '以快于步行的速度移动', 2, 2000, 'beginner'),
('eat', '把食物放入口中并咽下', 2, 1800, 'beginner'),
('sleep', '在休息状态下度过时间', 2, 900, 'beginner'),
('read', '查看并理解书面或打印材料', 2, 1100, 'beginner'),
('write', '用文字表达思想', 2, 1300, 'beginner'),
('speak', '用词语表达思想', 2, 1500, 'beginner'),
('listen', '用耳朵感知声音', 2, 700, 'beginner'),
('watch', '用眼睛观察', 2, 1200, 'beginner'),
('think', '在脑海中处理信息', 2, 1000, 'beginner');

-- 插入单词数据（形容词）
INSERT INTO word (spelling, meaning, part_of_speech_id, phonetic, frequency, difficulty_level) VALUES
('big', '尺寸或数量大的', 3, 1600, 'beginner'),
('small', '尺寸或数量小的', 3, 1700, 'beginner'),
('fast', '速度快的', 3, 1500, 'beginner'),
('slow', '速度慢的', 3, 1400, 'beginner'),
('happy', '快乐的', 3, 1100, 'beginner'),
('sad', '悲伤的', 3, 1000, 'beginner'),
('good', '好的', 3, 1800, 'beginner'),
('bad', '坏的', 3, 1700, 'beginner'),
('red', '红色的', 3, 1500, 'beginner'),
('blue', '蓝色的', 3, 1400, 'beginner');

-- 插入单词本数据
INSERT INTO word_book (name, description, difficulty_level, user_id, is_public) VALUES
('基础词汇', '包含最常见的英语单词，适合初学者', 'beginner', NULL, TRUE),
('日常生活词汇', '包含日常生活相关的单词', 'beginner', NULL, TRUE),
('商务英语词汇', '包含商务相关的词汇', 'intermediate', NULL, TRUE),
('学术英语词汇', '包含学术相关的词汇', 'advanced', NULL, TRUE);

-- ============================================================
-- 内容模块初始数据
-- ============================================================

-- 插入句子数据
INSERT INTO sentence (english_sentence, chinese_translation, difficulty_level, category, tags) VALUES
('The quick brown fox jumps over the lazy dog.', '敏捷的棕色狐狸跳过懒惰的狗。', 'beginner', 'common', 'quick,brown,fox,jumps,lazy,dog'),
('I love learning English.', '我喜欢学习英语。', 'beginner', 'common', 'love,learning,english'),
('Learning English is fun and useful.', '学习英语既有趣又有用。', 'beginner', 'education', 'learning,english,fun,useful'),
('Practice makes perfect.', '熟能生巧。', 'beginner', 'proverb', 'practice,perfect'),
('Knowledge is power.', '知识就是力量。', 'beginner', 'proverb', 'knowledge,power'),
('How are you today?', '你今天怎么样？', 'beginner', 'conversation', 'how,today'),
('What time is it?', '现在几点了？', 'beginner', 'conversation', 'what,time'),
('Where is the library?', '图书馆在哪里？', 'beginner', 'direction', 'where,library'),
('Thank you for your help.', '谢谢你的帮助。', 'beginner', 'conversation', 'thank,you,help');

-- 插入文章数据
INSERT INTO article (title, content, source, difficulty_level, reading_time_minutes, word_count) VALUES
('The Importance of Learning English', 'Learning English is essential in today\'s globalized world. It opens doors to education, career opportunities, and cultural understanding. This article explores why English is important and how to learn it effectively.', 'Education Blog', 'intermediate', 10, 850),
('How to Improve Your English Speaking Skills', 'Speaking English fluently is a common goal for English learners. This article provides practical tips and techniques to improve your English speaking skills, including pronunciation, vocabulary, and fluency.', 'Language Learning Blog', 'intermediate', 15, 1200),
('The Benefits of Reading English Books', 'Reading English books is one of the most effective ways to improve your English language skills. This article discusses the benefits of reading English books and recommends some good books for different levels.', 'Education Blog', 'beginner', 8, 650),
('English Grammar for Beginners', 'Understanding English grammar is crucial for speaking and writing correct English. This article covers the basics of English grammar, including parts of speech, sentence structure, and verb tenses.', 'Education Blog', 'beginner', 12, 950),
('Common English Mistakes to Avoid', 'Many English learners make common mistakes when speaking, writing, and reading English. This article identifies these mistakes and provides tips on how to avoid them.', 'Language Learning Blog', 'intermediate', 10, 1100);

-- 插入写作主题数据
INSERT INTO writing_topic (title, description, difficulty_level, min_word_count, max_word_count, time_limit_minutes, category, is_active) VALUES
('My Daily Routine', 'Write about your daily routine, including waking up, meals, work or school, and going to bed.', 'beginner', 100, 200, 15, 'daily', TRUE),
('My Favorite Hobby', 'Write about your favorite hobby, why you enjoy it, and how you practice it.', 'beginner', 150, 300, 20, 'hobby', TRUE),
('My Dream Vacation', 'Describe your dream vacation, where you want to go, what you want to do, and why.', 'intermediate', 200, 400, 30, 'vacation', TRUE),
('My Future Goals', 'Write about your future goals, both short-term and long-term, and how you plan to achieve them.', 'intermediate', 250, 500, 40, 'goals', TRUE),
('Technology in Modern Life', 'Discuss how technology affects our daily lives, including its benefits and drawbacks.', 'advanced', 300, 600, 45, 'technology', TRUE);

-- 插入语法分析数据
INSERT INTO grammar_analysis (title, content, category, is_active) VALUES
('Basic English Sentence Structure', 'Understanding basic English sentence structure is essential for writing correct English sentences. This article covers subject, verb, object, and complement.', 'beginner', TRUE),
('English Verb Tenses', 'English verbs change their form depending on the tense. This article explains the different verb tenses, including past, present, future, and their uses.', 'intermediate', TRUE),
('English Articles (A, An, The)', 'English articles can be confusing for English learners. This article explains when and how to use articles correctly.', 'beginner', TRUE),
('English Prepositions', 'Prepositions show the relationship between a noun or pronoun and other words. This article provides a comprehensive guide to English prepositions.', 'intermediate', TRUE),
('English Conditionals', 'Conditionals express a condition and the result of that condition. This article explains the different types of conditionals and their uses.', 'advanced', TRUE);

-- 插入听力资料数据
INSERT INTO listening_material (title, description, original_text, difficulty_level, file_format, duration_seconds) VALUES
('Daily Conversation', 'Listen to a typical daily conversation between two English speakers discussing their daily activities.', 'beginner', 'Text', 'mp3', 180),
('News Broadcast', 'Listen to a short news broadcast about current events.', 'intermediate', 'Text', 'mp3', 240),
('Educational Lecture', 'Listen to an educational lecture about a scientific topic.', 'advanced', 'Text', 'mp3', 600),
('Interview Dialogue', 'Listen to a job interview between a recruiter and an applicant.', 'intermediate', 'Text', 'mp3', 300),
('Weather Report', 'Listen to a weather report describing the weather conditions in different cities.', 'beginner', 'Text', 'mp3', 120);

-- ============================================================
-- 活动模块初始数据
-- ============================================================

-- 插入用户活动事件（示例，实际应从用户行为记录）
-- 注意：这些是示例数据，实际应用中应从用户操作自动记录

-- ============================================================
-- 完成DML脚本
-- ============================================================

SELECT 'DML script executed successfully' AS result;

-- 显示插入的数据统计
SELECT
    (SELECT COUNT(*) FROM part_of_speech) AS part_of_speech_count,
    (SELECT COUNT(*) FROM word) AS word_count,
    (SELECT COUNT(*) FROM word_book) AS word_book_count,
    (SELECT COUNT(*) FROM sentence) AS sentence_count,
    (SELECT COUNT(*) FROM article) AS article_count,
    (SELECT COUNT(*) FROM writing_topic) AS writing_topic_count,
    (SELECT COUNT(*) FROM grammar_analysis) AS grammar_analysis_count,
    (SELECT COUNT(*) FROM listening_material) AS listening_material_count
) AS data_summary;

SELECT NOW() AS current_time;
