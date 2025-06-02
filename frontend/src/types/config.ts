/**
 * 应用配置接口
 */
export interface AppConfig {
  apiBaseUrl: string;
  appName: string;
  defaultLanguage: string;
  supportedLanguages: {
    code: string;
    name: string;
  }[];
  defaultPageSize: number;
  maxUploadSize: number;
  tokenKey: string;
  tokenExpiryKey: string;
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
}

/**
 * 单词难度级别枚举
 */
export enum DifficultyLevel {
  VERY_EASY = 1,
  EASY = 2,
  MEDIUM = 3,
  HARD = 4,
  VERY_HARD = 5
}

/**
 * 单词难度级别配置
 */
export interface DifficultyLevelConfig {
  value: DifficultyLevel;
  label: string;
  color: string;
}

/**
 * 句子变体类型枚举
 */
export enum SentenceVariantType {
  PASSIVE = 'PASSIVE',
  QUESTION = 'QUESTION',
  NEGATIVE = 'NEGATIVE',
  PAST_TENSE = 'PAST_TENSE',
  FUTURE_TENSE = 'FUTURE_TENSE',
  CONDITIONAL = 'CONDITIONAL',
  OTHER = 'OTHER'
}

/**
 * 句子变体类型配置
 */
export interface SentenceVariantTypeConfig {
  value: SentenceVariantType;
  label: string;
  description: string;
}