import axios from './axios';
import { WordBook } from '@/types';

const BASE_URL = '/api/v1/vocabulary/wordbook';

// 获取所有单词本
export const getAllWordBooks = () => {
  return axios.get<WordBook[]>(`${BASE_URL}`);
};

// 根据ID获取单词本
export const getWordBookById = (id: string) => {
  return axios.get<WordBook>(`${BASE_URL}/${id}`);
};

// 创建单词本
export const createWordBook = (wordBook: Omit<WordBook, 'id'>) => {
  return axios.post<WordBook>(`${BASE_URL}`, wordBook);
};

// 更新单词本
export const updateWordBook = (id: string, wordBook: Partial<WordBook>) => {
  return axios.put<WordBook>(`${BASE_URL}/${id}`, wordBook);
};

// 删除单词本
export const deleteWordBook = (id: string) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 批量删除单词本
export const batchDeleteWordBooks = (ids: string[]) => {
  return axios.delete(`${BASE_URL}/batch`, { data: { ids } });
};

// 向单词本添加单词
export const addWordToWordBook = (wordBookId: string, wordIds: string | string[]) => {
  // 如果是单个wordId，转换为数组
  const wordIdList = Array.isArray(wordIds) ? wordIds : [wordIds];
  return axios.post(`${BASE_URL}/${wordBookId}/words`, wordIdList);
};

// 从单词本移除单词
export const removeWordFromWordBook = (wordBookId: string, wordId: string) => {
  return axios.delete(`${BASE_URL}/${wordBookId}/words/${wordId}`);
};