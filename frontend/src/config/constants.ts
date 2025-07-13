/**
 * API常量配置
 */

// 从应用配置中导入API基础URL
import { appConfig } from './app.config';

// API基础URL
export const API_BASE_URL = appConfig.apiBaseUrl;

// 分页默认值
export const DEFAULT_PAGE_SIZE = appConfig.defaultPageSize;

// 认证相关常量
export const AUTH_TOKEN_KEY = appConfig.tokenKey;
export const AUTH_TOKEN_EXPIRY_KEY = appConfig.tokenExpiryKey;

// 活动类型常量
export const ACTIVITY_TYPES = {
  WORD_CREATED: '创建单词',
  WORD_UPDATED: '更新单词',
  WORD_MEANING_ADDED: '添加释义',
  SENTENCE_CREATED: '创建句子',
  ARTICLE_CREATED: '创建文章',
  DICTATION_COMPLETED: '完成听写',
  WRITING_COMPLETED: '完成写作'
};

// 模块类型常量
export const MODULE_TYPES = {
  VOCABULARY: 'vocabulary',
  CONTENT: 'content',
  PRACTICE: 'practice',
  TEST: 'test'
};