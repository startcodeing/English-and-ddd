import axios, { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { appConfig } from '../config';

// 创建axios实例
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem(appConfig.tokenKey);
    if (token) {
      // 设置Authorization头
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 检查响应数据格式
    const data = response.data;
    
    // 如果响应已经是标准格式（包含success字段），直接返回
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }
    
    // 否则，将响应包装为标准格式
    return {
      success: true,
      message: response.statusText || '请求成功',
      data: data
    };
  },
  (error: AxiosError) => {
    if (error.response) {
      // 尝试从响应中提取后端返回的错误信息
      const responseData = error.response.data as any;
      let errorMessage = '请求失败';
      
      // 检查是否有后端返回的错误信息
      if (responseData) {
        if (responseData.message) {
          // 使用后端返回的错误信息
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          // 如果响应数据是字符串，直接使用
          errorMessage = responseData;
        }
      }
      
      // 为错误对象添加自定义属性，方便上层组件获取
      (error as any).errorMessage = errorMessage;
      
      // 处理HTTP错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem(appConfig.tokenKey);
          window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          console.error('禁止访问:', errorMessage);
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在:', errorMessage);
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误:', errorMessage);
          break;
        default:
          console.error(`未处理的错误状态码: ${error.response.status}`, errorMessage);
      }
      
      // 返回标准格式的错误响应
      return Promise.reject({
        success: false,
        message: errorMessage,
        data: null,
        errorCode: error.response.status.toString()
      });
    } else if (error.request) {
      // 请求已发送但没有收到响应
      const errorMessage = '网络错误，无法连接到服务器';
      console.error(errorMessage);
      (error as any).errorMessage = errorMessage;
      
      // 返回标准格式的错误响应
      return Promise.reject({
        success: false,
        message: errorMessage,
        data: null,
        errorCode: 'NETWORK_ERROR'
      });
    } else {
      // 请求配置有误
      const errorMessage = `请求配置错误: ${error.message}`;
      console.error(errorMessage);
      (error as any).errorMessage = errorMessage;
      
      // 返回标准格式的错误响应
      return Promise.reject({
        success: false,
        message: errorMessage,
        data: null,
        errorCode: 'REQUEST_ERROR'
      });
    }
  }
);

export const axiosInstance = instance;