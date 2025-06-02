import { useState, useCallback } from 'react';

interface UseAsyncReturn<T, E = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

/**
 * 异步操作Hook
 * @param asyncFunction 异步函数
 * @param immediate 是否立即执行
 * @returns 异步操作状态和控制方法
 */
export const useAsync = <T, E = Error>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseAsyncReturn<T, E> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err as E);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
};