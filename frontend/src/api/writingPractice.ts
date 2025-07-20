import axios from './axios';
import { StandardApiResponse } from '../types/response';

const BASE_URL = '/api/v1/writing-practices';

// 写作练习类型
export interface WritingPractice {
  id: number;
  topicId: number;
  status: 'draft' | 'published' | 'submitted';
  content: string;
  score: number;
  createTime: string;
  updateTime: string;
}

// 写作练习查询参数
export interface WritingPracticeQuery {
  status?: string;
  topicId?: number;
  pageNum?: number;
  pageSize?: number;
}

// 创建写作练习
export const createWritingPractice = (data: Partial<WritingPractice>): Promise<StandardApiResponse<WritingPractice>> => {
  return axios.post(BASE_URL, data);
};

// 获取写作练习详情
export const getWritingPracticeById = (id: string | number): Promise<StandardApiResponse<WritingPractice>> => {
  return axios.get(`${BASE_URL}/${id}`);
};

// 获取写作练习列表
export const getWritingPractices = (params: WritingPracticeQuery): Promise<StandardApiResponse<WritingPractice[]>> => {
  return axios.get(`${BASE_URL}/search`, { params });
};

// 获取写作练习总数
export const countWritingPractices = (params: WritingPracticeQuery): Promise<StandardApiResponse<number>> => {
  return axios.get(`${BASE_URL}/count/search`, { params });
};

// 更新写作练习
export const updateWritingPractice = (id: string | number, data: Partial<WritingPractice>): Promise<StandardApiResponse<WritingPractice>> => {
  return axios.put(`${BASE_URL}/${id}`, data);
};

// 删除写作练习
export const deleteWritingPractice = (id: string | number): Promise<StandardApiResponse<void>> => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 批量删除写作练习
export const batchDeleteWritingPractices = (ids: (string | number)[]): Promise<StandardApiResponse<void>> => {
  return axios.delete(`${BASE_URL}/batch`, { data: ids });
};