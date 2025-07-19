/**
 * 统一API响应接口
 */
export interface StandardApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string | null;
}