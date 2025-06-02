import { appConfig } from '../config';

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  roles: string[];
}

/**
 * 保存认证令牌到本地存储
 * @param token 认证令牌
 * @param expiryTime 过期时间（毫秒时间戳）
 */
export const saveToken = (token: string, expiryTime?: number): void => {
  localStorage.setItem(appConfig.tokenKey, token);
  if (expiryTime) {
    localStorage.setItem(appConfig.tokenExpiryKey, expiryTime.toString());
  }
};

/**
 * 获取认证令牌
 * @returns 认证令牌或null
 */
export const getToken = (): string | null => {
  return localStorage.getItem(appConfig.tokenKey);
};

/**
 * 获取令牌过期时间
 * @returns 过期时间（毫秒时间戳）或null
 */
export const getTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(appConfig.tokenExpiryKey);
  return expiry ? parseInt(expiry, 10) : null;
};

/**
 * 检查令牌是否过期
 * @returns 是否过期
 */
export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  return expiry ? Date.now() > expiry : true;
};

/**
 * 清除认证信息
 */
export const clearAuth = (): void => {
  localStorage.removeItem(appConfig.tokenKey);
  localStorage.removeItem(appConfig.tokenExpiryKey);
  localStorage.removeItem('user_info');
};

/**
 * 保存用户信息
 * @param userInfo 用户信息
 */
export const saveUserInfo = (userInfo: UserInfo): void => {
  localStorage.setItem('user_info', JSON.stringify(userInfo));
};

/**
 * 获取用户信息
 * @returns 用户信息或null
 */
export const getUserInfo = (): UserInfo | null => {
  const userInfoStr = localStorage.getItem('user_info');
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr) as UserInfo;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

/**
 * 检查用户是否已认证
 * @returns 是否已认证
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token && !isTokenExpired();
};

/**
 * 检查用户是否有指定角色
 * @param role 角色名称
 * @returns 是否有该角色
 */
export const hasRole = (role: string): boolean => {
  const userInfo = getUserInfo();
  return userInfo ? userInfo.roles.includes(role) : false;
};

/**
 * 检查用户是否有指定角色之一
 * @param roles 角色名称数组
 * @returns 是否有指定角色之一
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const userInfo = getUserInfo();
  return userInfo ? roles.some(role => userInfo.roles.includes(role)) : false;
};