import { BaseEntity } from './models';

/**
 * 写作练习接口
 */
export interface WritingExercise extends BaseEntity {
  title: string;
  topic: string;
  prompt?: string;
  requirements?: string;
  wordLimit?: number;
  timeLimit?: number; // 分钟
  difficultyLevel?: number;
  content?: string;
  status: 'draft' | 'submitted' | 'reviewed';
  createdAt: number;
  updatedAt?: number;
  submittedAt?: number;
  userId: string;
}

/**
 * 写作反馈接口
 */
export interface WritingFeedback extends BaseEntity {
  exerciseId: string;
  content: string;
  grammarCorrections?: string;
  vocabularySuggestions?: string;
  structureComments?: string;
  overallScore?: number;
  grammarScore?: number;
  vocabularyScore?: number;
  structureScore?: number;
  createdAt: number;
  reviewerId?: string;
}