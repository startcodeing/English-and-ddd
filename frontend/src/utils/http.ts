import { PaginationRequest } from '../types';

/**
 * 构建查询参数字符串
 * @param params 参数对象
 * @returns 查询参数字符串
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const validParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map(item => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`)
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });
  
  return validParams.length > 0 ? `?${validParams.join('&')}` : '';
};

/**
 * 构建分页查询参数
 * @param pagination 分页请求参数
 * @param extraParams 额外参数
 * @returns 完整的查询参数对象
 */
export const buildPaginationParams = (
  pagination: PaginationRequest,
  extraParams: Record<string, any> = {}
): Record<string, any> => {
  return {
    page: pagination.page,
    size: pagination.size,
    sort: pagination.sort,
    ...extraParams
  };
};

/**
 * 解析URL查询参数
 * @param queryString 查询参数字符串
 * @returns 解析后的参数对象
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  if (!queryString || queryString === '?') return {};
  
  const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  const pairs = query.split('&');
  const result: Record<string, string> = {};
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  });
  
  return result;
};

/**
 * 从URL中提取路径参数
 * @param pattern 路径模式，如 '/users/:id'
 * @param url 实际URL，如 '/users/123'
 * @returns 提取的参数对象，如 { id: '123' }
 */
export const extractPathParams = (
  pattern: string,
  url: string
): Record<string, string> => {
  const patternParts = pattern.split('/');
  const urlParts = url.split('/');
  const params: Record<string, string> = {};
  
  patternParts.forEach((part, index) => {
    if (part.startsWith(':') && urlParts[index]) {
      const paramName = part.substring(1);
      params[paramName] = urlParts[index];
    }
  });
  
  return params;
};

/**
 * 构建带路径参数的URL
 * @param pattern 路径模式，如 '/users/:id'
 * @param params 参数对象，如 { id: '123' }
 * @returns 构建的URL，如 '/users/123'
 */
export const buildUrl = (
  pattern: string,
  params: Record<string, string | number> = {}
): string => {
  let url = pattern;
  
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  
  return url;
};