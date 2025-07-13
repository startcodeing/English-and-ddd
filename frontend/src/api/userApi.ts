import axios from './axios';
import { User } from '../store/authSlice';
import { getUserInfo } from '../utils/auth';

/**
 * 获取当前用户信息
 * 由于后端暂未实现/api/user/profile接口，此处从localStorage获取用户信息
 * @returns 用户信息
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    // 从localStorage获取用户信息
    const userInfo = getUserInfo();
    if (!userInfo) {
      throw new Error('用户信息不存在');
    }
    
    // 将UserInfo转换为User类型
    const user: User = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email || '',
      role: userInfo.roles[0] || 'user',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    return user;
    
    // 后端实现接口后可以使用以下代码
    // const response = await axios.get<User>('/api/user/profile');
    // return response;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};