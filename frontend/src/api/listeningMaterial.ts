import axios from './axios';
import { ListeningMaterial, ListeningMaterialDifficultyLevel } from '../types/listeningMaterial';
import type { ListeningMaterialQuery } from '../types/listeningMaterial';
import type { CreateListeningMaterialRequest, UpdateListeningMaterialRequest } from '../types/listeningMaterial';
import { ListeningMaterialAdapter } from '../adapters/ListeningMaterialAdapter';

const BASE_URL = '/api/v1';

// 获取所有听力资料
export const getAllListeningMaterials = async () => {
  const response = await axios.get(`${BASE_URL}/listening-materials/page`, {
    params: { pageNum: 1, pageSize: 100 }
  });
  response.data = ListeningMaterialAdapter.adaptList(response.data);
  return response;
};

// 分页获取听力资料
export const getListeningMaterialsByPage = async (page: number, size: number) => {
  const response = await axios.get(`${BASE_URL}/listening-materials/page`, {
    params: { pageNum: page, pageSize: size }
  });
  response.data = ListeningMaterialAdapter.adaptList(response.data);
  return response;
};

// 根据ID获取听力资料
export const getListeningMaterialById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/listening-materials/${id}`);
  response.data = ListeningMaterialAdapter.adapt(response.data);
  return response;
};

// 根据标题模糊查询听力资料
export const getListeningMaterialsByTitle = async (title: string) => {
  const response = await axios.get(`${BASE_URL}/listening-materials/search`, {
    params: { title }
  });
  response.data = ListeningMaterialAdapter.adaptList(response.data);
  return response;
};

// 根据难度级别查询听力资料
export const getListeningMaterialsByDifficultyLevel = async (difficulty: ListeningMaterialDifficultyLevel) => {
  const response = await axios.get(`${BASE_URL}/listening-materials/difficulty/${difficulty}`);
  response.data = ListeningMaterialAdapter.adaptList(response.data);
  return response;
};

// 创建听力资料（包含文件上传）
export const createListeningMaterial = async (data: CreateListeningMaterialRequest, file: File) => {
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
  response.data = ListeningMaterialAdapter.adapt(response.data);
  return response;
};

// 更新听力资料（包含文件上传）
export const updateListeningMaterial = async (id: string, data: UpdateListeningMaterialRequest, file?: File) => {
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
  response.data = ListeningMaterialAdapter.adapt(response.data);
  return response;
};

// 删除听力资料
export const deleteListeningMaterial = (id: string) => {
  return axios.delete(`${BASE_URL}/listening-materials/${id}`);
};

// 批量删除听力资料
export const batchDeleteListeningMaterials = (ids: string[]) => {
  return axios.delete(`${BASE_URL}/listening-materials/batch`, { data: { ids } });
};