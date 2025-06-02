import { BaseEntity, DictationResult } from './models';
import { Word } from './models';

/**
 * 听写练习接口
 */
export interface DictationExercise extends BaseEntity {
  title: string;
  description?: string;
  wordIds: string[];
  words?: Word[];
  difficultyLevel?: number;
  timeLimit?: number; // 分钟
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: number;
  updatedAt?: number;
  completedAt?: number;
  score?: number;
  userId: string;
}

// 重新导出 DictationResult 以便在 API 中使用
export type { DictationResult };