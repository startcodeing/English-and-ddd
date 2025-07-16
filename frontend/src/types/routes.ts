/**
 * 路由路径枚举
 */
export enum RoutePath {
  // 主页
  HOME = '/',
  
  // 词汇管理
  VOCABULARY = '/vocabulary',
  WORDS = '/vocabulary/words',
  WORD_DETAIL = '/vocabulary/words/:id',
  PARTS_OF_SPEECH = '/vocabulary/parts-of-speech',
  WORD_BOOKS = '/vocabulary/word-books',
  WORD_BOOK_DETAIL = '/vocabulary/word-books/:id',
  
  // 内容管理
  CONTENT = '/content',
  SENTENCES = '/content/sentences',
  SENTENCE_DETAIL = '/content/sentences/:id',
  ARTICLES = '/content/articles',
  ARTICLE_DETAIL = '/content/articles/:id',
  ARTICLE_READ = '/content/article/read/:id',
  
  // 练习模块
  PRACTICE = '/practice',
  DICTATIONS = '/practice/dictations',
  DICTATION_DETAIL = '/practice/dictations/:id',
  DICTATION_EXERCISE = '/practice/dictations/:id/exercise',
  DICTATION_RESULT = '/practice/dictations/:id/result',
  WRITINGS = '/practice/writings',
  WRITING_DETAIL = '/practice/writings/:id',
  WRITING_EXERCISE = '/practice/writings/:id/exercise',
  WRITING_RESULT = '/practice/writings/:id/result',
  
  // 用户相关
  USER = '/user',
  USER_ACTIVITIES = '/user/activities',
  
  // 设置
  SETTINGS = '/settings',
  
  // 错误页面
  NOT_FOUND = '*'
}

/**
 * 路由参数接口
 */
export interface RouteParams {
  id?: string;
}

/**
 * 路由查询参数接口
 */
export interface RouteQueryParams {
  page?: string;
  size?: string;
  sort?: string;
  filter?: string;
  search?: string;
}