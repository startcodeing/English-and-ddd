import { axiosInstance, StandardApiResponse } from '@/api/index';
import { GrammarAnalysis } from '@/types/grammar-analysis';

export const getGrammarAnalyses = async (params: { title?: string; difficulty?: string; page?: number; size?: number; }) => {
    return await axiosInstance.get<StandardApiResponse<GrammarAnalysis[]>>('/grammar-analysis/search', { params });
};

export const countGrammarAnalyses = async (params: { title?: string; difficulty?: string; }) => {
    return await axiosInstance.get<StandardApiResponse<number>>('/grammar-analysis/count', { params });
};

export const getGrammarAnalysis = async (id: number) => {
    return await axiosInstance.get<StandardApiResponse<GrammarAnalysis>>(`/grammar-analysis/${id}`);
};

export const createGrammarAnalysis = async (data: Partial<GrammarAnalysis>) => {
    return await axiosInstance.post<StandardApiResponse<GrammarAnalysis>>('/grammar-analysis', data);
};

export const updateGrammarAnalysis = async (id: number, data: Partial<GrammarAnalysis>) => {
    return await axiosInstance.put<StandardApiResponse<GrammarAnalysis>>(`/grammar-analysis/${id}`, data);
};

export const deleteGrammarAnalysis = async (id: number) => {
    return await axiosInstance.delete<StandardApiResponse<void>>(`/grammar-analysis/${id}`);
};