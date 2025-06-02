import axios from './axios';
import { Sentence } from '@/types';

const BASE_URL = '/api/content/sentence';

// 获取所有句子
export const getAllSentences = () => {
  return axios.get<Sentence[]>(`${BASE_URL}`);
};

// 根据ID获取句子
export const getSentenceById = (id: string) => {
  return axios.get<Sentence>(`${BASE_URL}/${id}`);
};

// 根据英文内容模糊查询句子
export const getSentencesByEnglishContent = (content: string) => {
  return axios.get<Sentence[]>(`${BASE_URL}/english-content`, {
    params: { content }
  });
};

// 根据中文意思模糊查询句子
export const getSentencesByChineseMeaning = (meaning: string) => {
  return axios.get<Sentence[]>(`${BASE_URL}/chinese-meaning`, {
    params: { meaning }
  });
};

// 创建句子
export const createSentence = (sentence: Omit<Sentence, 'id'>) => {
  return axios.post<Sentence>(`${BASE_URL}`, sentence);
};

// 更新句子
export const updateSentence = (id: string, sentence: Partial<Sentence>) => {
  return axios.put<Sentence>(`${BASE_URL}/${id}`, sentence);
};

// 删除句子
export const deleteSentence = (id: string) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 添加陌生单词到句子
export const addUnfamiliarWordToSentence = (sentenceId: string, wordId: string) => {
  return axios.post(`${BASE_URL}/${sentenceId}/unfamiliar-words/${wordId}`);
};

// 从句子移除陌生单词
export const removeUnfamiliarWordFromSentence = (sentenceId: string, wordId: string) => {
  return axios.delete(`${BASE_URL}/${sentenceId}/unfamiliar-words/${wordId}`);
};