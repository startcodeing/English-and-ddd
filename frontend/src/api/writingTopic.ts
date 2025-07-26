import axios from './axios';
import { StandardApiResponse } from '../types/response';

// 修改基础URL，修正为正确的API路径
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
export const getWritingTopics = async (params: WritingTopicQuery): Promise<StandardApiResponse<WritingTopic[]>> => {
  try {
    const response = await axios.get(BASE_URL, { params });
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取写作主题列表失败',
      data: []
    };
  }
};

// 获取写作主题总数
export const countWritingTopics = async (params: WritingTopicQuery): Promise<StandardApiResponse<number>> => {
  try {
    const response = await axios.get(`${BASE_URL}/count`, { params });
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取写作主题总数失败',
      data: 0
    };
  }
};

// 获取写作主题详情
export const getWritingTopicById = async (id: string | number): Promise<StandardApiResponse<WritingTopic>> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取写作主题详情失败',
      data: null
    };
  }
};

// 创建写作主题
export const createWritingTopic = async (data: Partial<WritingTopic>): Promise<StandardApiResponse<WritingTopic>> => {
  try {
    const response = await axios.post(BASE_URL, data);
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '创建写作主题失败',
      data: null
    };
  }
};

// 更新写作主题
export const updateWritingTopic = async (id: number, data: Partial<WritingTopic>): Promise<StandardApiResponse<WritingTopic>> => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '更新写作主题失败',
      data: null
    };
  }
};

// 删除写作主题
export const deleteWritingTopic = async (id: number): Promise<StandardApiResponse<boolean>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: true
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '删除写作主题失败',
      data: false
    };
  }
};

// 批量删除写作主题
export const batchDeleteWritingTopics = (ids: (string | number)[]): Promise<StandardApiResponse<boolean>> => {
  return axios.delete(BASE_URL, { data: { ids } });
};