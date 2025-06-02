import axios from './axios';
import { DictationExercise, DictationResult } from '@/types';

const BASE_URL = '/api/dictation';

// 创建听写练习
export const createDictationExercise = (exercise: Omit<DictationExercise, 'id'>) => {
  return axios.post<DictationExercise>(`${BASE_URL}/exercise`, exercise);
};

// 获取听写练习
export const getDictationExerciseById = (id: string) => {
  return axios.get<DictationExercise>(`${BASE_URL}/exercise/${id}`);
};

// 获取用户的所有听写练习
export const getUserDictationExercises = () => {
  return axios.get<DictationExercise[]>(`${BASE_URL}/exercise/user`);
};

// 提交听写结果
export const submitDictationResult = (exerciseId: string, result: Omit<DictationResult, 'id'>) => {
  return axios.post<DictationResult>(`${BASE_URL}/exercise/${exerciseId}/result`, result);
};

// 获取听写结果
export const getDictationResultById = (id: string) => {
  return axios.get<DictationResult>(`${BASE_URL}/result/${id}`);
};

// 获取听写练习的所有结果
export const getDictationResultsByExerciseId = (exerciseId: string) => {
  return axios.get<DictationResult[]>(`${BASE_URL}/exercise/${exerciseId}/results`);
};

// 获取听写对比报告
export const getDictationComparisonReport = (resultId: string) => {
  return axios.get(`${BASE_URL}/result/${resultId}/comparison-report`);
};

// 获取听写统计数据
export const getDictationStatistics = () => {
  return axios.get(`${BASE_URL}/statistics`);
};