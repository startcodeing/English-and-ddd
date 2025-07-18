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
    // 直接返回响应数据
    return response.data;
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
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，无法连接到服务器');
      (error as any).errorMessage = '网络错误，无法连接到服务器';
    } else {
      // 请求配置有误
      console.error('请求配置错误:', error.message);
      (error as any).errorMessage = `请求配置错误: ${error.message}`;
    }
    return Promise.reject(error);
  }
);

export default instance;