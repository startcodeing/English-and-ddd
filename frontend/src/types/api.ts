/**
 * API响应基础接口
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页请求参数接口
 */
export interface PaginationRequest {
  page: number;
  size: number;
  sort?: string;
}

/**
 * 分页响应接口
 */
export interface PaginationResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 词性查询参数
 */
export interface PartOfSpeechQuery {
  englishName?: string;
  chineseMeaning?: string;
}

/**
 * 单词查询参数
 */
export interface WordQuery {
  spelling?: string;
  difficultyLevel?: number;
  partOfSpeechId?: string;
}

/**
 * 单词本查询参数
 */
export interface WordBookQuery {
  name?: string;
}

/**
 * 句子查询参数
 */
export interface SentenceQuery {
  englishContent?: string;
  chineseMeaning?: string;
}

/**
 * 文章查询参数
 */
export interface ArticleQuery {
  title?: string;
  content?: string;
  source?: string;
  author?: string;
  difficultyLevel?: number;
}

/**
 * 听写练习查询参数
 */
export interface DictationQuery {
  title?: string;
  startDate?: number;
  endDate?: number;
  completed?: boolean;
}

/**
 * 听写结果查询参数
 */
export interface DictationResultQuery {
  dictationId: string;
}

/**
 * 写作练习查询参数
 */
export interface WritingQuery {
  title?: string;
  startDate?: number;
  endDate?: number;
  submitted?: boolean;
}

/**
 * 听写练习创建参数
 */
export interface CreateDictationRequest {
  title: string;
  description?: string;
  wordIds: string[];
}

/**
 * 听写结果提交参数
 */
export interface SubmitDictationResultRequest {
  dictationId: string;
  results: {
    wordId: string;
    userInput: string;
  }[];
}

/**
 * 写作练习创建参数
 */
export interface CreateWritingRequest {
  title: string;
  topic: string;
}

/**
 * 写作练习提交参数
 */
export interface SubmitWritingRequest {
  writingId: string;
  content: string;
}