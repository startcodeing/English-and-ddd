import { useState, useEffect, useCallback } from 'react';
import { PaginationRequest, PaginationResponse } from '@/types';

interface UsePaginationProps<T, P> {
  fetchFunction: (params: PaginationRequest & P) => Promise<PaginationResponse<T>>;
  initialParams?: P;
  initialPageSize?: number;
  initialPage?: number;
  initialSort?: string;
  deps?: any[];
}

interface UsePaginationReturn<T, P> {
  data: T[];
  loading: boolean;
  error: Error | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  params: P;
  setParams: (params: P) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSort: (sort: string) => void;
  refresh: () => void;
}

/**
 * 分页数据Hook
 * @param props 配置项
 * @returns 分页数据和控制方法
 */
export const usePagination = <T, P extends Record<string, any>>(
  props: UsePaginationProps<T, P>
): UsePaginationReturn<T, P> => {
  const {
    fetchFunction,
    initialParams = {} as P,
    initialPageSize = 10,
    initialPage = 0,
    initialSort = '',
    deps = []
  } = props;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<P>(initialParams);
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 0
  });
  const [sort, setSort] = useState(initialSort);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchFunction({
        page: pagination.current,
        size: pagination.pageSize,
        sort,
        ...params
      });

      setData(response.content);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements,
        totalPages: response.totalPages
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pagination.current, pagination.pageSize, sort, params, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      current: page
    }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      current: 0 // 重置到第一页
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    params,
    setParams,
    setPage,
    setPageSize,
    setSort,
    refresh
  };
};