import axios from './axios';
import { PartOfSpeech } from '@/types';

const BASE_URL = '/api/v1/vocabulary/part-of-speech';

// 获取所有词性
export const getAllPartOfSpeech = () => {
  return axios.get<PartOfSpeech[]>(`${BASE_URL}`);
};

// 根据ID获取词性
export const getPartOfSpeechById = (id: string) => {
  return axios.get<PartOfSpeech>(`${BASE_URL}/${id}`);
};

// 创建词性
export const createPartOfSpeech = (partOfSpeech: Omit<PartOfSpeech, 'id'>) => {
  return axios.post<PartOfSpeech>(`${BASE_URL}`, partOfSpeech);
};

// 更新词性
export const updatePartOfSpeech = (id: string, partOfSpeech: Partial<PartOfSpeech>) => {
  return axios.put<PartOfSpeech>(`${BASE_URL}/${id}`, partOfSpeech);
};

// 删除词性
export const deletePartOfSpeech = (id: string) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 批量删除词性
export const batchDeletePartOfSpeech = (ids: string[]) => {
  return axios.delete(`${BASE_URL}/batch`, { data: { ids } });
};