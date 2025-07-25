import { AppConfig, ThemeConfig, DifficultyLevel, DifficultyLevelConfig, SentenceVariantType, SentenceVariantTypeConfig } from '../types';

/**
 * 应用配置
 */
export const appConfig: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  appName: import.meta.env.VITE_APP_NAME || '英语学习平台',
  defaultLanguage: import.meta.env.VITE_DEFAULT_LOCALE || 'zh-CN',
  supportedLanguages: [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' }
  ],
  defaultPageSize: 10,
  maxUploadSize: 5 * 1024 * 1024, // 5MB
  tokenKey: 'auth_token',
  tokenExpiryKey: 'auth_token_expiry'
};

/**
 * 主题配置 - 亮色主题
 */
export const lightThemeConfig: ThemeConfig = {
  primaryColor: '#1890ff',
  secondaryColor: '#722ed1',
  successColor: '#52c41a',
  warningColor: '#faad14',
  errorColor: '#f5222d',
  infoColor: '#1890ff',
  backgroundColor: '#f0f2f5',
  textColor: '#000000d9',
  borderRadius: 2
};

/**
 * 主题配置 - 暗色主题
 */
export const darkThemeConfig: ThemeConfig = {
  primaryColor: '#177ddc',
  secondaryColor: '#531dab',
  successColor: '#49aa19',
  warningColor: '#d89614',
  errorColor: '#d32029',
  infoColor: '#177ddc',
  backgroundColor: '#141414',
  textColor: '#ffffffd9',
  borderRadius: 2
};

/**
 * 单词难度级别配置
 */
export const difficultyLevelConfigs: DifficultyLevelConfig[] = [
  {
    value: DifficultyLevel.VERY_EASY,
    label: '非常简单',
    color: '#52c41a'
  },
  {
    value: DifficultyLevel.EASY,
    label: '简单',
    color: '#95de64'
  },
  {
    value: DifficultyLevel.MEDIUM,
    label: '中等',
    color: '#faad14'
  },
  {
    value: DifficultyLevel.HARD,
    label: '困难',
    color: '#fa8c16'
  },
  {
    value: DifficultyLevel.VERY_HARD,
    label: '非常困难',
    color: '#f5222d'
  }
];

/**
 * 句子变体类型配置
 */
export const sentenceVariantTypeConfigs: SentenceVariantTypeConfig[] = [
  {
    value: SentenceVariantType.PASSIVE,
    label: '被动语态',
    description: '将主动语态句子转换为被动语态'
  },
  {
    value: SentenceVariantType.QUESTION,
    label: '疑问句',
    description: '将陈述句转换为疑问句'
  },
  {
    value: SentenceVariantType.NEGATIVE,
    label: '否定句',
    description: '将肯定句转换为否定句'
  },
  {
    value: SentenceVariantType.PAST_TENSE,
    label: '过去时',
    description: '将现在时句子转换为过去时'
  },
  {
    value: SentenceVariantType.FUTURE_TENSE,
    label: '将来时',
    description: '将现在时句子转换为将来时'
  },
  {
    value: SentenceVariantType.CONDITIONAL,
    label: '条件句',
    description: '将句子转换为条件句形式'
  },
  {
    value: SentenceVariantType.OTHER,
    label: '其他',
    description: '其他类型的句子变体'
  }
];