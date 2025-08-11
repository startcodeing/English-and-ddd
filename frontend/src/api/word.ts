import axios from './axios';
import { Word, WordMeaning, WordDetail } from '@/types';
import { StandardApiResponse } from './index';
import { AxiosResponse } from 'axios';

const BASE_URL = '/api/v1/vocabulary/word';

// 获取所有单词
export const getAllWords = (): Promise<AxiosResponse<StandardApiResponse<Word[]>>> => {
  return axios.get(`${BASE_URL}`);
};

// 根据ID获取单词
export const getWordById = (id: string): Promise<AxiosResponse<StandardApiResponse<Word>>> => {
  return axios.get(`${BASE_URL}/${id}`);
};

// 根据ID获取单词详情
export const getWordDetail = (id: string): Promise<AxiosResponse<StandardApiResponse<WordDetail>>> => {
  return axios.get(`${BASE_URL}/detail/${id}`);
};

// 根据拼写查询单词
export const getWordBySpelling = (spelling: string) => {
  return axios.get<Word[]>(`${BASE_URL}/spelling/${spelling}`);
};

// 根据难度级别查询单词
export const getWordsByDifficultyLevel = (level: number) => {
  return axios.get<Word[]>(`${BASE_URL}/difficulty/${level}`);
};

// 创建单词
export const createWord = (word: Omit<Word, 'id'>) => {
  return axios.post<Word>(`${BASE_URL}`, word);
};

// 更新单词
export const updateWord = (id: string, word: Partial<Word>) => {
  return axios.put<Word>(`${BASE_URL}/${id}`, word);
};

// 删除单词
export const deleteWord = (id: string) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 批量删除单词
export const batchDeleteWords = (ids: string[]) => {
  return axios.delete(`${BASE_URL}/batch`, { data: ids });
};

// 添加词性
export const addWordMeaning = (wordMeaning: Omit<WordMeaning, 'id'>) => {
  return axios.post<Word>(`${BASE_URL}/wordMeaning`, wordMeaning);
};

// 删除词性
export const deleteWordMeaning = (wordId: string, wordMeaningId: string) => {
  return axios.delete<Word>(`${BASE_URL}/${wordId}/wordMeaning/${wordMeaningId}`);
};