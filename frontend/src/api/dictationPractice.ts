import axios from './axios';
import { StandardApiResponse } from '../types/response';

const BASE_URL = '/api/practice/dictation';

// 听写练习接口类型定义
export interface DictationPractice {
  id: number;
  listenMaterialId: number;
  listenMaterialTitle?: string;
  listenMaterialDifficulty?: string;
  status: string;
  content: string;
  score?: number;
  userId: number;
  username: string;
  createTime: string;
  updateTime: string;
}

export interface DictationPracticeQuery {
  status?: string;
  listenMaterialId?: number;
  pageNum?: number;
  pageSize?: number;
}

// 获取听写练习列表
export const getDictationPractices = async (params: DictationPracticeQuery): Promise<StandardApiResponse<DictationPractice[]>> => {
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
      message: error.response?.data?.message || error.message || '获取听写练习列表失败',
      data: []
    };
  }
};

// 根据ID获取听写练习
export const getDictationPracticeById = async (id: number): Promise<StandardApiResponse<DictationPractice>> => {
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
      message: error.response?.data?.message || error.message || '获取听写练习详情失败',
      data: null
    };
  }
};

// 创建听写练习
export const createDictationPractice = async (data: Partial<DictationPractice>): Promise<StandardApiResponse<DictationPractice>> => {
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
      message: error.response?.data?.message || error.message || '创建听写练习失败',
      data: null
    };
  }
};

// 更新听写练习
export const updateDictationPractice = async (id: number, data: Partial<DictationPractice>): Promise<StandardApiResponse<DictationPractice>> => {
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
      message: error.response?.data?.message || error.message || '更新听写练习失败',
      data: null
    };
  }
};

// 提交听写练习
export const submitDictationPractice = async (id: number): Promise<StandardApiResponse<DictationPractice>> => {
  try {
    if (!id || isNaN(id)) {
      return {
        success: false,
        message: '无效的练习ID',
        data: null
      };
    }
    
    const response = await axios.post(`${BASE_URL}/${id}/submit`);
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: response.data
    };
  } catch (error: any) {
    console.error('提交听写练习失败:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || '提交听写练习失败',
      data: null
    };
  }
};

// 评分听写练习
export const scoreDictationPractice = async (id: number, score: number): Promise<StandardApiResponse<DictationPractice>> => {
  try {
    const response = await axios.post(`${BASE_URL}/${id}/score`, null, {
      params: { score }
    });
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '评分听写练习失败',
      data: null
    };
  }
};

// 统计听写练习数量
export const countDictationPractices = async (params: DictationPracticeQuery): Promise<StandardApiResponse<number>> => {
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
      message: error.response?.data?.message || error.message || '统计听写练习数量失败',
      data: 0
    };
  }
};

// 删除听写练习
export const deleteDictationPractice = async (id: number): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: undefined
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '删除听写练习失败',
      data: undefined
    };
  }
};

// 批量删除听写练习
export const batchDeleteDictationPractices = async (ids: number[]): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(BASE_URL, { data: ids });
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
      data: undefined
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '批量删除听写练习失败',
      data: undefined
    };
  }
};