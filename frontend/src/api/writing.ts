import axios from './axios';
import { WritingExercise, WritingFeedback } from '@/types';
import { StandardApiResponse } from '../types/response';

const BASE_URL = '/api/writing';

// 创建写作练习
export const createWritingExercise = async (exercise: Omit<WritingExercise, 'id'>): Promise<StandardApiResponse<WritingExercise>> => {
  try {
    const response = await axios.post<WritingExercise>(`${BASE_URL}/exercise`, exercise);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<WritingExercise>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '创建写作练习成功',
      data: response || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingExercise>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '创建写作练习失败',
      data: null
    };
  }
};

// 获取写作练习
export const getWritingExerciseById = async (id: string): Promise<StandardApiResponse<WritingExercise>> => {
  try {
    const response = await axios.get<WritingExercise>(`${BASE_URL}/exercise/${id}`);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<WritingExercise>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取写作练习成功',
      data: response || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingExercise>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取写作练习失败',
      data: null
    };
  }
};

// 获取用户的所有写作练习
export const getUserWritingExercises = async (): Promise<StandardApiResponse<WritingExercise[]>> => {
  try {
    const response = await axios.get<WritingExercise[]>(`${BASE_URL}/exercise/user`);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<WritingExercise[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取用户写作练习列表成功',
      data: response || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingExercise[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取用户写作练习列表失败',
      data: []
    };
  }
};

// 更新写作练习
export const updateWritingExercise = async (id: string, exercise: Partial<WritingExercise>): Promise<StandardApiResponse<WritingExercise>> => {
  try {
    const response = await axios.put<WritingExercise>(`${BASE_URL}/exercise/${id}`, exercise);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<WritingExercise>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '更新写作练习成功',
      data: response || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingExercise>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '更新写作练习失败',
      data: null
    };
  }
};

// 删除写作练习
export const deleteWritingExercise = async (id: string): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/exercise/${id}`);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '删除写作练习成功',
      data: undefined
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '删除写作练习失败',
      data: undefined
    };
  }
};

// 提交写作反馈
export const submitWritingFeedback = async (exerciseId: string, feedback: Omit<WritingFeedback, 'id'>): Promise<StandardApiResponse<WritingFeedback>> => {
  try {
    const response = await axios.post<WritingFeedback>(`${BASE_URL}/exercise/${exerciseId}/feedback`, feedback);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<WritingFeedback>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '提交写作反馈成功',
      data: response || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingFeedback>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '提交写作反馈失败',
      data: null
    };
  }
};

// 获取写作反馈
export const getWritingFeedbackById = async (id: string): Promise<StandardApiResponse<WritingFeedback>> => {
  try {
    const response = await axios.get<WritingFeedback>(`${BASE_URL}/feedback/${id}`);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<WritingFeedback>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取写作反馈成功',
      data: response || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingFeedback>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取写作反馈失败',
      data: null
    };
  }
};

// 获取写作练习的所有反馈
export const getWritingFeedbacksByExerciseId = async (exerciseId: string): Promise<StandardApiResponse<WritingFeedback[]>> => {
  try {
    const response = await axios.get<WritingFeedback[]>(`${BASE_URL}/exercise/${exerciseId}/feedbacks`);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<WritingFeedback[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取写作练习反馈列表成功',
      data: response || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<WritingFeedback[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取写作练习反馈列表失败',
      data: []
    };
  }
};

// 获取写作统计数据
export const getWritingStatistics = async (): Promise<StandardApiResponse<any>> => {
  try {
    const response = await axios.get(`${BASE_URL}/statistics`);
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<any>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取写作统计数据成功',
      data: response || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<any>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取写作统计数据失败',
      data: null
    };
  }
};