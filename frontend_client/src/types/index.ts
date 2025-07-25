// 用户相关类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  totalStudyDays: number;
  continuousStudyDays: number;
  totalWords: number;
  totalSentences: number;
  totalArticles: number;
  createdAt: string;
}

// 学习内容类型定义
export interface Word {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  audioUrl?: string;
}

export interface Sentence {
  id: string;
  content: string;
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  words: Word[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  difficulty: 'easy' | 'medium' | 'hard';
  readingTime: number;
  words: Word[];
  category: string;
}

export interface ListeningMaterial {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WritingTopic {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

// 学习计划类型定义
export interface StudyPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  dailyGoal: {
    words: number;
    sentences: number;
    articles: number;
    studyTime: number;
  };
  status: 'active' | 'completed' | 'paused';
  progress: number;
}

// 学习记录类型定义
export interface StudyRecord {
  id: string;
  userId: string;
  contentType: 'word' | 'sentence' | 'article' | 'listening' | 'writing';
  contentId: string;
  studyTime: number;
  score?: number;
  isCorrect?: boolean;
  createdAt: string;
}

// 测试相关类型定义
export interface Question {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Test {
  id: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'writing' | 'comprehensive';
  difficulty: string;
  duration: number;
  questionCount: number;
  category: string;
  tags: string[];
  estimatedScore: number;
  completionRate: number;
  questions?: Question[];
  timeLimit?: number;
  passingScore?: number;
  createdAt?: string;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  duration: number;
  category: string;
  difficulty: string;
  answers?: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

// 社区相关类型定义
export interface StudyCheckIn {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  studyTime: number;
  wordsLearned: number;
  articlesRead: number;
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
  studyType: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isJoined: boolean;
  avatar: string;
  createdAt: string;
  tags: string[];
  dailyActiveMembers: number;
  weeklyGoal: string;
  createdBy?: string;
}

// 统计数据类型定义
export interface StudyStats {
  totalStudyTime: number;
  todayStudyTime: number;
  weekStudyTime: number;
  monthStudyTime: number;
  totalWords: number;
  totalSentences: number;
  totalArticles: number;
  continuousStudyDays: number;
  weeklyProgress: Array<{
    date: string;
    studyTime: number;
    wordsLearned: number;
  }>;
  monthlyProgress: Array<{
    month: string;
    studyTime: number;
    wordsLearned: number;
  }>;
}

// API响应类型定义
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 学习推荐类型定义
export interface DailyRecommendation {
  words: Word[];
  sentences: Sentence[];
  articles: Article[];
  listeningMaterials: ListeningMaterial[];
  writingTopics: WritingTopic[];
}

// 成就系统类型定义
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

// 错题本类型定义
export interface WrongQuestion {
  id: string;
  userId?: string;
  questionId?: string;
  type: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  wrongCount: number;
  lastReviewDate: string;
  isResolved: boolean;
  difficulty: string;
  tags: string[];
  createdAt?: string;
}

// 收藏类型定义
export interface FavoriteContent {
  id: string;
  userId?: string;
  type: 'word' | 'sentence' | 'article' | 'listening';
  contentId?: string;
  title: string;
  content: string;
  source: string;
  addedDate: string;
  tags: string[];
  notes?: string;
}