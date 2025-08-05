import axios from './axios';
import { StandardApiResponse } from '../types/response';

const BASE_URL = '/api/practice/dictation';

// 听写练习难度级别枚举
export enum DictationDifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM', 
  HARD = 'HARD'
}

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
  title?: string;
  difficulty?: string;
}

// 分页获取听写练习列表
export const getDictationPracticesByPage = async (pageNum: number = 1, pageSize: number = 10): Promise<StandardApiResponse<DictationPractice[]>> => {
  try {
    const response = await axios.get(BASE_URL, { 
      params: { pageNum, pageSize } 
    });
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<DictationPractice[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听写练习列表成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<DictationPractice[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '获取听写练习列表失败',
      data: []
    };
  }
};

// 获取听写练习列表
export const getDictationPractices = async (params: DictationPracticeQuery): Promise<StandardApiResponse<DictationPractice[]>> => {
  try {
    const response = await axios.get(BASE_URL, { params });
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<DictationPractice[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听写练习列表成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<DictationPractice[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '获取听写练习列表失败',
      data: []
    };
  }
};

// 根据ID获取听写练习
export const getDictationPracticeById = async (id: number): Promise<StandardApiResponse<DictationPractice>> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听写练习详情成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '获取听写练习详情失败',
      data: null
    };
  }
};

// 创建听写练习
export const createDictationPractice = async (data: Partial<DictationPractice>): Promise<StandardApiResponse<DictationPractice>> => {
  try {
    const response = await axios.post(BASE_URL, data);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '创建听写练习成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '创建听写练习失败',
      data: null
    };
  }
};

// 更新听写练习
export const updateDictationPractice = async (id: number, data: Partial<DictationPractice>): Promise<StandardApiResponse<DictationPractice>> => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '更新听写练习成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '更新听写练习失败',
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
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '提交听写练习成功',
      data: response.data || null
    };
  } catch (error: any) {
    console.error('提交听写练习失败:', error);
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '提交听写练习失败',
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
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '评分听写练习成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<DictationPractice>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '评分听写练习失败',
      data: null
    };
  }
};

// 统计听写练习数量
export const countDictationPractices = async (params: DictationPracticeQuery): Promise<StandardApiResponse<number>> => {
  try {
    const response = await axios.get(`${BASE_URL}/count`, { params });
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<number>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '统计听写练习数量成功',
      data: response.data || 0
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<number>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '统计听写练习数量失败',
      data: 0
    };
  }
};

// 删除听写练习
export const deleteDictationPractice = async (id: number): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '删除听写练习成功',
      data: undefined
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '删除听写练习失败',
      data: undefined
    };
  }
};

// 批量删除听写练习
export const batchDeleteDictationPractices = async (ids: number[]): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(BASE_URL, { data: ids });
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '批量删除听写练习成功',
      data: undefined
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && error !== null && 'success' in error) {
      return error as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: (error && error.message) || '批量删除听写练习失败',
      data: undefined
    };
  }
};