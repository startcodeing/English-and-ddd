import axios from './axios';
import { ListeningMaterial, ListeningMaterialDifficultyLevel } from '../types/listeningMaterial';
import type { ListeningMaterialQuery } from '../types/listeningMaterial';
import type { CreateListeningMaterialRequest, UpdateListeningMaterialRequest } from '../types/listeningMaterial';
import { ListeningMaterialAdapter } from '../adapters/ListeningMaterialAdapter';
import { StandardApiResponse } from '../types/response';

const BASE_URL = '/api/v1';

// 获取所有听力资料
export const getAllListeningMaterials = async (): Promise<StandardApiResponse<ListeningMaterial[]>> => {
  try {
    const response = await axios.get(`${BASE_URL}/listening-materials/page`, {
      params: { pageNum: 1, pageSize: 100 }
    });
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<ListeningMaterial[]>;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取所有听力资料成功',
      data: response.data || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<ListeningMaterial[]>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '获取所有听力资料失败',
      data: []
    };
  }
};

// 分页获取听力资料
export const getListeningMaterialsByPage = async (page: number, size: number): Promise<StandardApiResponse<ListeningMaterial[]>> => {
  try {
    const response = await axios.get(`${BASE_URL}/listening-materials/page`, {
      params: { pageNum: page, pageSize: size }
    });
    
    // 适配数据
    const adaptedData = ListeningMaterialAdapter.adaptList(response.data.data);
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      const standardResponse = response.data as StandardApiResponse<ListeningMaterial[]>;
      standardResponse.data = adaptedData;
      return standardResponse;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '分页获取听力资料成功',
      data: adaptedData || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<ListeningMaterial[]>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '分页获取听力资料失败',
      data: []
    };
  }
};

// 根据ID获取听力资料
export const getListeningMaterialById = async (id: string): Promise<StandardApiResponse<ListeningMaterial>> => {
  try {
    const response = await axios.get(`${BASE_URL}/listening-materials/${id}`);
    
    // 适配数据
    const adaptedData = ListeningMaterialAdapter.adapt(response.data.data);
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      const standardResponse = response.data as StandardApiResponse<ListeningMaterial>;
      standardResponse.data = adaptedData;
      return standardResponse;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听力资料详情成功',
      data: adaptedData || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<ListeningMaterial>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '获取听力资料详情失败',
      data: null
    };
  }
};

// 根据标题模糊查询听力资料
export const getListeningMaterialsByTitle = async (title: string): Promise<StandardApiResponse<ListeningMaterial[]>> => {
  try {
    const response = await axios.get(`${BASE_URL}/listening-materials/search`, {
      params: { title }
    });
    
    // 适配数据
    const adaptedData = ListeningMaterialAdapter.adaptList(response.data);
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      const standardResponse = response.data as StandardApiResponse<ListeningMaterial[]>;
      standardResponse.data = adaptedData;
      return standardResponse;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '根据标题查询听力资料成功',
      data: adaptedData || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<ListeningMaterial[]>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '根据标题查询听力资料失败',
      data: []
    };
  }
};

// 根据难度级别查询听力资料
export const getListeningMaterialsByDifficultyLevel = async (difficulty: ListeningMaterialDifficultyLevel): Promise<StandardApiResponse<ListeningMaterial[]>> => {
  try {
    const response = await axios.get(`${BASE_URL}/listening-materials/difficulty/${difficulty}`);
    
    // 适配数据
    const adaptedData = ListeningMaterialAdapter.adaptList(response.data);
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      const standardResponse = response.data as StandardApiResponse<ListeningMaterial[]>;
      standardResponse.data = adaptedData;
      return standardResponse;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '根据难度级别查询听力资料成功',
      data: adaptedData || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<ListeningMaterial[]>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '根据难度级别查询听力资料失败',
      data: []
    };
  }
};

// 创建听力资料（包含文件上传）
export const createListeningMaterial = async (data: CreateListeningMaterialRequest, file: File): Promise<StandardApiResponse<ListeningMaterial>> => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('originContent', data.transcript);
    formData.append('difficulty', data.difficulty.toString());
    formData.append('audioFile', file);

    const response = await axios.post(`${BASE_URL}/listening-materials`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 适配数据
    const adaptedData = ListeningMaterialAdapter.adapt(response.data);
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      const standardResponse = response.data as StandardApiResponse<ListeningMaterial>;
      standardResponse.data = adaptedData;
      return standardResponse;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '创建听力资料成功',
      data: adaptedData || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<ListeningMaterial>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '创建听力资料失败',
      data: null
    };
  }
};

// 更新听力资料（包含文件上传）
export const updateListeningMaterial = async (id: string, data: UpdateListeningMaterialRequest, file?: File): Promise<StandardApiResponse<ListeningMaterial>> => {
  try {
    const formData = new FormData();
    
    if (data.title) formData.append('title', data.title);
    if (data.transcript) formData.append('originContent', data.transcript);
    if (data.difficulty) formData.append('difficulty', data.difficulty.toString());
    if (file) formData.append('audioFile', file);
    // 如果clearAudio为true，添加清除音频文件的标志
    if (data.clearAudio) formData.append('clearAudio', 'true');

    const response = await axios.put(`${BASE_URL}/listening-materials/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 适配数据
    const adaptedData = ListeningMaterialAdapter.adapt(response.data);
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      const standardResponse = response.data as StandardApiResponse<ListeningMaterial>;
      standardResponse.data = adaptedData;
      return standardResponse;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '更新听力资料成功',
      data: adaptedData || null
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<ListeningMaterial>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '更新听力资料失败',
      data: null
    };
  }
};

// 删除听力资料
export const deleteListeningMaterial = async (id: string): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/listening-materials/${id}`);
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<void>;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '删除听力资料成功',
      data: undefined
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<void>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '删除听力资料失败',
      data: undefined
    };
  }
};

// 批量删除听力资料
export const batchDeleteListeningMaterials = async (ids: string[]): Promise<StandardApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_URL}/listening-materials/batch`, { data: { ids } });
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<void>;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '批量删除听力资料成功',
      data: undefined
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error !== null && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<void>;
    }
    
    // 否则包装为标准格式
    return {
      success: false,
      message: error?.message || '批量删除听力资料失败',
      data: undefined
    };
  }
};

// 获取听力资料总数
export const countListeningMaterials = async (): Promise<StandardApiResponse<number>> => {
  try {
    const response = await axios.get(`${BASE_URL}/listening-materials/count`);
    
    // 检查响应是否已经是标准格式
    if (typeof response.data === 'object' && 'success' in response.data) {
      return response.data as StandardApiResponse<number>;
    }
    
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取听力资料总数成功',
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
      message: error?.message || '获取听力资料总数失败',
      data: 0
    };
  }
};

// 如果后端没有直接提供计数接口，可以通过获取所有资料来计算总数
export const getListeningMaterialsCount = async (): Promise<number> => {
  try {
    const response = await getAllListeningMaterials();
    return response.data?.length || 0;
  } catch (error) {
    console.error('获取听力资料总数失败:', error);
    return 0;
  }
};