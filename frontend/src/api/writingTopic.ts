import axios from './axios';
import { StandardApiResponse } from '../types/response';

const BASE_URL = '/api/v1/writing-topics';

// 写作主题类型
export interface WritingTopic {
  id: number;
  description: string;
  source: string;
  difficulty: string;
  wordLimit: number;
  timeLimit: number;
  createTime: string;
  updateTime: string;
}

// 写作主题查询参数
export interface WritingTopicQuery {
  description?: string;
  source?: string;
  difficulty?: string;
  pageNum?: number;
  pageSize?: number;
}

// 获取写作主题列表
export const getWritingTopics = (params: WritingTopicQuery): Promise<StandardApiResponse<WritingTopic[]>> => {
  return axios.get(`${BASE_URL}/search`, { params });
};

// 获取写作主题总数
export const countWritingTopics = (params: WritingTopicQuery): Promise<StandardApiResponse<number>> => {
  return axios.get(`${BASE_URL}/count/search`, { params });
};

// 获取写作主题详情
export const getWritingTopicById = (id: string | number): Promise<StandardApiResponse<WritingTopic>> => {
  return axios.get(`${BASE_URL}/${id}`);
};

// 创建写作主题
export const createWritingTopic = (data: Partial<WritingTopic>): Promise<StandardApiResponse<WritingTopic>> => {
  return axios.post(BASE_URL, data);
};

// 更新写作主题
export const updateWritingTopic = (id: string | number, data: Partial<WritingTopic>): Promise<StandardApiResponse<WritingTopic>> => {
  return axios.put(`${BASE_URL}/${id}`, data);
};

// 删除写作主题
export const deleteWritingTopic = (id: string | number): Promise<StandardApiResponse<void>> => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 批量删除写作主题
export const batchDeleteWritingTopics = (ids: (string | number)[]): Promise<StandardApiResponse<void>> => {
  return axios.delete(`${BASE_URL}/batch`, { data: ids });
};