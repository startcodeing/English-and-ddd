import axios from './axios';
import { Article } from '@/types';

const BASE_URL = '/api/v1/articles';

// 获取所有文章
export const getAllArticles = () => {
  return axios.get<Article[]>(`${BASE_URL}`);
};

// 根据ID获取文章
export const getArticleById = (id: string) => {
  return axios.get<Article>(`${BASE_URL}/${id}`);
};

// 根据标题模糊查询文章
export const getArticlesByTitle = (title: string) => {
  return axios.get<Article[]>(`${BASE_URL}/title`, {
    params: { title }
  });
};

// 根据内容模糊查询文章
export const getArticlesByContent = (content: string) => {
  return axios.get<Article[]>(`${BASE_URL}/content`, {
    params: { content }
  });
};

// 根据出处查询文章
export const getArticlesBySource = (source: string) => {
  return axios.get<Article[]>(`${BASE_URL}/source`, {
    params: { source }
  });
};

// 根据作者查询文章
export const getArticlesByAuthor = (author: string) => {
  return axios.get<Article[]>(`${BASE_URL}/author`, {
    params: { author }
  });
};

// 根据难度级别查询文章
export const getArticlesByDifficultyLevel = (level: number) => {
  return axios.get<Article[]>(`${BASE_URL}/difficulty/${level}`);
};

// 创建文章
export const createArticle = (article: Omit<Article, 'id'>) => {
  return axios.post<Article>(`${BASE_URL}`, article);
};

// 更新文章
export const updateArticle = (id: string, article: Partial<Article>) => {
  return axios.put<Article>(`${BASE_URL}/${id}`, article);
};

// 删除文章
export const deleteArticle = (id: string) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

// 添加句子到文章
export const addSentenceToArticle = (articleId: string, sentenceId: string) => {
  return axios.post(`${BASE_URL}/${articleId}/sentences/${sentenceId}`);
};

// 从文章移除句子
export const removeSentenceFromArticle = (articleId: string, sentenceId: string) => {
  return axios.delete(`${BASE_URL}/${articleId}/sentences/${sentenceId}`);
};

// 添加陌生单词到文章
export const addUnfamiliarWordToArticle = (articleId: string, wordId: string) => {
  return axios.post(`${BASE_URL}/${articleId}/unfamiliar-words/${wordId}`);
};

// 从文章移除陌生单词
export const removeUnfamiliarWordFromArticle = (articleId: string, wordId: string) => {
  return axios.delete(`${BASE_URL}/${articleId}/unfamiliar-words/${wordId}`);
};

// 批量删除文章
export const batchDeleteArticles = (ids: string[]) => {
  return axios.delete(`${BASE_URL}/batch`, { data: { ids } });
};