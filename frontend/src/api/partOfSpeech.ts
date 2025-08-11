import axios from './axios';
import { PartOfSpeech } from '@/types';
import { StandardApiResponse } from './index';
import { AxiosResponse } from 'axios';

const BASE_URL = '/api/v1/vocabulary/part-of-speech';

// 获取所有词性
export const getAllPartOfSpeech = (): Promise<AxiosResponse<StandardApiResponse<PartOfSpeech[]>>> => {
  return axios.get(`${BASE_URL}`);
};

// 根据ID获取词性
export const getPartOfSpeechById = (id: string): Promise<AxiosResponse<StandardApiResponse<PartOfSpeech>>> => {
  return axios.get(`${BASE_URL}/${id}`);
};

// 创建词性
export const createPartOfSpeech = (partOfSpeech: Omit<PartOfSpeech, 'id'>): Promise<AxiosResponse<StandardApiResponse<PartOfSpeech>>> => {
  return axios.post(`${BASE_URL}`, partOfSpeech);
};

// 更新词性
export const updatePartOfSpeech = (id: string, partOfSpeech: Partial<PartOfSpeech>): Promise<AxiosResponse<StandardApiResponse<PartOfSpeech>>> => {
  return axios.put(`${BASE_URL}/${id}`, partOfSpeech);
};

// 删除词性
export const deletePartOfSpeech = (id: string): Promise<AxiosResponse<StandardApiResponse<void>>> => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 批量删除词性
export const batchDeletePartOfSpeech = (ids: string[]): Promise<AxiosResponse<StandardApiResponse<void>>> => {
  return axios.delete(`${BASE_URL}/batch`, { data: { ids } });
};