import axios from './axios';
import { Sentence } from '@/types';
import { StandardApiResponse } from '../types/response';

const BASE_URL = '/api/v1/sentences';

// 获取所有句子
export const getAllSentences = async (): Promise<StandardApiResponse<Sentence[]>> => {
  try {
    const response = await axios.get<Sentence[]>(`${BASE_URL}`);
    // 检查响应是否已经是标准格式
    // if (typeof response.data === 'object' && 'success' in response.data) {
    //   return response.data as StandardApiResponse<Sentence[]>;
    // }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取所有句子成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<Sentence[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取所有句子失败',
      data: []
    };
  }
};

// 根据ID获取句子
export const getSentenceById = async (id: string): Promise<StandardApiResponse<Sentence>> => {
  try {
    const response = await axios.get<Sentence>(`${BASE_URL}/${id}`);
    // 检查响应是否已经是标准格式
    // if (typeof response.data === 'object' && 'success' in response.data) {
    //   return response.data as StandardApiResponse<Sentence>;
    // }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取句子成功',
      data: response.data || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<Sentence>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取句子失败',
      data: null
    };
  }
};

// 根据英文内容模糊查询句子
export const getSentencesByEnglishContent = async (content: string): Promise<StandardApiResponse<Sentence[]>> => {
  try {
    const response = await axios.get<Sentence[]>(`${BASE_URL}/english-content`, {
      params: { content }
    });
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data) {
      return response.data as StandardApiResponse<Sentence[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '根据英文内容查询句子成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<Sentence[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '根据英文内容查询句子失败',
      data: []
    };
  }
};

// 根据中文意思模糊查询句子
export const getSentencesByChineseMeaning = async (meaning: string): Promise<StandardApiResponse<Sentence[]>> => {
  try {
    const response = await axios.get<Sentence[]>(`${BASE_URL}/chinese-meaning`, {
      params: { meaning }
    });
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data) {
      return response.data as StandardApiResponse<Sentence[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '根据中文意思查询句子成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<Sentence[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '根据中文意思查询句子失败',
      data: []
    };
  }
};

/**
 * 创建句子
 * 
 * @param sentence 句子数据
 * @returns 创建结果
 */
export const createSentence = async (sentence: Omit<Sentence, 'id' | 'createdAt' | 'updatedAt'>): Promise<StandardApiResponse<Sentence>> => {
  try {
    const response = await axios.post<Sentence>('/api/sentences', sentence);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data && 'message' in response.data && 'data' in response.data) {
      return response.data as StandardApiResponse<Sentence>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '创建句子成功',
      data: response.data
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<Sentence>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '创建句子失败',
      data: null as any
    };
  }
};

// 更新句子
/**
 * 更新句子
 * 
 * @param id 句子ID
 * @param sentence 更新的句子数据
 * @returns 更新结果
 */
export const updateSentence = async (id: string, sentence: Partial<Sentence>): Promise<StandardApiResponse<Sentence>> => {
  try {
    const response = await axios.put<Sentence>(`/api/sentences/${id}`, sentence);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data && 'message' in response.data && 'data' in response.data) {
      return response.data as StandardApiResponse<Sentence>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '更新句子成功',
      data: response.data
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<Sentence>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '更新句子失败',
      data: null as any
    };
  }
};

// 删除句子
export const deleteSentence = async (id: string): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data) {
      return response.data as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '删除句子成功',
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
      message: error.message || '删除句子失败',
      data: undefined
    };
  }
};

// 批量删除句子
export const batchDeleteSentences = async (ids: string[]): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/batch`, { data: { ids } });
    // 检查响应是否已经是标准格式
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'success' in response.data) {
      return response.data as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '批量删除句子成功',
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
      message: error.message || '批量删除句子失败',
      data: undefined
    };
  }
};

// 添加陌生单词到句子
export const addUnfamiliarWordToSentence = async (sentenceId: string, wordId: string): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.post(`${BASE_URL}/${sentenceId}/unfamiliar-words/${wordId}`);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '添加陌生单词到句子成功',
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
      message: error.message || '添加陌生单词到句子失败',
      data: undefined
    };
  }
};

// 从句子移除陌生单词
export const removeUnfamiliarWordFromSentence = async (sentenceId: string, wordId: string): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${sentenceId}/unfamiliar-words/${wordId}`);
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<void>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '从句子移除陌生单词成功',
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
      message: error.message || '从句子移除陌生单词失败',
      data: undefined
    };
  }
};