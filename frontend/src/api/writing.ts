import axios from './axios';
import { WritingExercise, WritingFeedback } from '@/types';

const BASE_URL = '/api/writing';

// 创建写作练习
export const createWritingExercise = (exercise: Omit<WritingExercise, 'id'>) => {
  return axios.post<WritingExercise>(`${BASE_URL}/exercise`, exercise);
};

// 获取写作练习
export const getWritingExerciseById = (id: string) => {
  return axios.get<WritingExercise>(`${BASE_URL}/exercise/${id}`);
};

// 获取用户的所有写作练习
export const getUserWritingExercises = () => {
  return axios.get<WritingExercise[]>(`${BASE_URL}/exercise/user`);
};

// 更新写作练习
export const updateWritingExercise = (id: string, exercise: Partial<WritingExercise>) => {
  return axios.put<WritingExercise>(`${BASE_URL}/exercise/${id}`, exercise);
};

// 删除写作练习
export const deleteWritingExercise = (id: string) => {
  return axios.delete(`${BASE_URL}/exercise/${id}`);
};

// 提交写作反馈
export const submitWritingFeedback = (exerciseId: string, feedback: Omit<WritingFeedback, 'id'>) => {
  return axios.post<WritingFeedback>(`${BASE_URL}/exercise/${exerciseId}/feedback`, feedback);
};

// 获取写作反馈
export const getWritingFeedbackById = (id: string) => {
  return axios.get<WritingFeedback>(`${BASE_URL}/feedback/${id}`);
};

// 获取写作练习的所有反馈
export const getWritingFeedbacksByExerciseId = (exerciseId: string) => {
  return axios.get<WritingFeedback[]>(`${BASE_URL}/exercise/${exerciseId}/feedbacks`);
};

// 获取写作统计数据
export const getWritingStatistics = () => {
  return axios.get(`${BASE_URL}/statistics`);
};