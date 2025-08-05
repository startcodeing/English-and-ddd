import axios from './axios';
import { StandardApiResponse } from '../types/response';

// 修改基础URL，与听写练习保持一致的格式
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
export const createWritingPractice = async (data: Partial<WritingPractice>): Promise<StandardApiResponse<WritingPractice>> => {
  try {
    const response = await axios.post(BASE_URL, data);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<WritingPractice>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '创建写作练习成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingPractice>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '创建写作练习失败',
      data: null
    };
  }
};

// 获取写作练习详情
export const getWritingPracticeById = async (id: string | number): Promise<StandardApiResponse<WritingPractice>> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<WritingPractice>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取写作练习详情成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingPractice>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '获取写作练习详情失败',
      data: null
    };
  }
};

// 获取写作练习列表
export const getWritingPractices = async (params: WritingPracticeQuery): Promise<StandardApiResponse<WritingPractice[]>> => {
  try {
    // 修改为与听写练习相同的API路径格式
    const response = await axios.get(`${BASE_URL}/search`, { params });
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<WritingPractice[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取写作练习列表成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingPractice[]>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '获取写作练习列表失败',
      data: []
    };
  }
};

// 获取写作练习总数
export const countWritingPractices = async (params: WritingPracticeQuery): Promise<StandardApiResponse<number>> => {
  try {
    // 修改为与听写练习相同的API路径格式
    const response = await axios.get(`${BASE_URL}/count/search`, { params });
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<number>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取写作练习总数成功',
      data: response.data || 0
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<number>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '获取写作练习总数失败',
      data: 0
    };
  }
};

// 更新写作练习
export const updateWritingPractice = async (id: string | number, data: Partial<WritingPractice>): Promise<StandardApiResponse<WritingPractice>> => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<WritingPractice>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '更新写作练习成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingPractice>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '更新写作练习失败',
      data: null
    };
  }
};

// 删除写作练习
export const deleteWritingPractice = async (id: string | number): Promise<StandardApiResponse<boolean>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<boolean>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '删除写作练习成功',
      data: true
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<boolean>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '删除写作练习失败',
      data: false
    };
  }
};

// 批量删除写作练习
export const batchDeleteWritingPractices = async (ids: (string | number)[]): Promise<StandardApiResponse<boolean>> => {
  try {
    const response = await axios.delete(BASE_URL, { data: { ids } });
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<boolean>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '批量删除写作练习成功',
      data: true
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<boolean>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '批量删除写作练习失败',
      data: false
    };
  }
};