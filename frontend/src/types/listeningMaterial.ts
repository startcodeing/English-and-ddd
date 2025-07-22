import { BaseEntity } from './models';

/**
 * 听力材料难度级别枚举
 */
export enum ListeningMaterialDifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

/**
 * 听力资料接口
 */
export interface ListeningMaterial extends BaseEntity {
  title: string;
  transcript: string; // 保持前端字段名称不变，但实际对应后端的originContent
  originContent: string; // 后端返回的原文字段
  difficulty: ListeningMaterialDifficultyLevel;
  audioUrl: string;
  fileSize: number;
  duration: number;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * 听力资料查询参数
 */
export interface ListeningMaterialQuery {
  title?: string;
  difficulty?: ListeningMaterialDifficultyLevel;
}

/**
 * 听力资料创建参数
 */
export interface CreateListeningMaterialRequest {
  title: string;
  transcript: string;
  difficulty: ListeningMaterialDifficultyLevel;
  audioFile: File;
}

/**
 * 听力资料更新参数
 */
export interface UpdateListeningMaterialRequest {
  title?: string;
  transcript?: string;
  difficulty?: ListeningMaterialDifficultyLevel;
  audioFile?: File;
}