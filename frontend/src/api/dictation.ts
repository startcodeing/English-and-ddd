import axios from './axios';
import { DictationExercise, DictationResult } from '@/types';
import { StandardApiResponse } from '../types/response';

const BASE_URL = '/api/dictation';

// 创建听写练习
export const createDictationExercise = async (exercise: Omit<DictationExercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<StandardApiResponse<DictationExercise>> => {
  try {
    const response = await axios.post<DictationExercise>(`${BASE_URL}/exercise`, exercise);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data && 'message' in response.data && 'data' in response.data) {
      return response.data as StandardApiResponse<DictationExercise>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '创建听写练习成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<DictationExercise>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '创建听写练习失败',
      data: null
    };
  }
};

// 获取听写练习
export const getDictationExerciseById = async (id: string): Promise<StandardApiResponse<DictationExercise>> => {
  try {
    const response = await axios.get<DictationExercise>(`${BASE_URL}/exercise/${id}`);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data && 'message' in response.data && 'data' in response.data) {
      return response.data as StandardApiResponse<DictationExercise>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听写练习成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<DictationExercise>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取听写练习失败',
      data: null
    };
  }
};

// 获取用户的所有听写练习
export const getUserDictationExercises = async (): Promise<StandardApiResponse<DictationExercise[]>> => {
  try {
    const response = await axios.get<DictationExercise[]>(`${BASE_URL}/exercise/user`);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data && 'message' in response.data && 'data' in response.data) {
      return response.data as StandardApiResponse<DictationExercise[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取用户听写练习列表成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<DictationExercise[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取用户听写练习列表失败',
      data: []
    };
  }
};

/**
 * 提交听写结果
 * 
 * @param result 听写结果数据
 * @returns 提交结果
 */
export const submitDictationResult = async (result: Omit<DictationResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<StandardApiResponse<DictationResult>> => {
  try {
    const response = await axios.post<DictationResult>('/api/dictation/results', result);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data && 'message' in response.data && 'data' in response.data) {
      return response.data as StandardApiResponse<DictationResult>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '提交听写结果成功',
      data: response.data
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<DictationResult>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '提交听写结果失败',
      data: null as any
    };
  }
};

// 获取听写结果
export const getDictationResultById = async (id: string): Promise<StandardApiResponse<DictationResult>> => {
  try {
    const response = await axios.get<DictationResult>(`/api/dictation/results/${id}`);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data && 'message' in response.data && 'data' in response.data) {
      return response.data as StandardApiResponse<DictationResult>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听写结果成功',
      data: response.data
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<DictationResult>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取听写结果失败',
      data: null as any
    };
  }
};

// 获取听写练习的所有结果
export const getDictationResultsByExerciseId = async (exerciseId: string): Promise<StandardApiResponse<DictationResult[]>> => {
  try {
    const response = await axios.get<DictationResult[]>(`${BASE_URL}/exercise/${exerciseId}/results`);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data) {
      return response.data as StandardApiResponse<DictationResult[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听写练习结果列表成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<DictationResult[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取听写练习结果列表失败',
      data: []
    };
  }
};

// 获取听写对比报告
export const getDictationComparisonReport = async (resultId: string): Promise<StandardApiResponse<any>> => {
  try {
    const response = await axios.get(`${BASE_URL}/result/${resultId}/comparison-report`);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data) {
      return response.data as StandardApiResponse<any>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听写对比报告成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<any>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取听写对比报告失败',
      data: null
    };
  }
};

// 获取听写统计数据
export const getDictationStatistics = async (): Promise<StandardApiResponse<any>> => {
  try {
    const response = await axios.get(`${BASE_URL}/statistics`);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data) {
      return response.data as StandardApiResponse<any>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听写统计数据成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<any>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取听写统计数据失败',
      data: null
    };
  }
};