import axios from './axios';
import { ListeningMaterial, ListeningMaterialDifficultyLevel } from '../types/listeningMaterial';
import type { ListeningMaterialQuery } from '../types/listeningMaterial';
import type { CreateListeningMaterialRequest, UpdateListeningMaterialRequest } from '../types/listeningMaterial';

const BASE_URL = '/api/v1';

// 获取所有听力资料
export const getAllListeningMaterials = () => {
  return axios.get<ListeningMaterial[]>(`${BASE_URL}/listening-materials/page`, {
    params: { pageNum: 1, pageSize: 100 }
  });
};

// 分页获取听力资料
export const getListeningMaterialsByPage = (page: number, size: number) => {
  return axios.get<ListeningMaterial[]>(`${BASE_URL}/listening-materials/page`, {
    params: { pageNum: page, pageSize: size }
  });
};

// 根据ID获取听力资料
export const getListeningMaterialById = (id: string) => {
  return axios.get<ListeningMaterial>(`${BASE_URL}/listening-materials/${id}`);
};

// 根据标题模糊查询听力资料
export const getListeningMaterialsByTitle = (title: string) => {
  return axios.get<ListeningMaterial[]>(`${BASE_URL}/listening-materials/search`, {
    params: { title }
  });
};

// 根据难度级别查询听力资料
export const getListeningMaterialsByDifficultyLevel = (difficulty: ListeningMaterialDifficultyLevel) => {
  return axios.get<ListeningMaterial[]>(`${BASE_URL}/listening-materials/difficulty/${difficulty}`);
};

// 创建听力资料（包含文件上传）
export const createListeningMaterial = (data: CreateListeningMaterialRequest, file: File) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('originContent', data.transcript);
  formData.append('difficulty', data.difficulty.toString());
  formData.append('audioFile', file);

  return axios.post<ListeningMaterial>(`${BASE_URL}/listening-materials`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 更新听力资料（包含文件上传）
export const updateListeningMaterial = (id: string, data: UpdateListeningMaterialRequest, file?: File) => {
  const formData = new FormData();
  
  if (data.title) formData.append('title', data.title);
  if (data.transcript) formData.append('originContent', data.transcript);
  if (data.difficulty) formData.append('difficulty', data.difficulty.toString());
  if (file) formData.append('audioFile', file);

  return axios.put<ListeningMaterial>(`${BASE_URL}/listening-materials/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 删除听力资料
export const deleteListeningMaterial = (id: string) => {
  return axios.delete(`${BASE_URL}/listening-materials/${id}`);
};

// 批量删除听力资料
export const batchDeleteListeningMaterials = (ids: string[]) => {
  return axios.delete(`${BASE_URL}/listening-materials/batch`, { data: { ids } });
};