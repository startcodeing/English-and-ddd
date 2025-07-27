import axios from './axios';
import { StandardApiResponse } from '../types/response';

export interface UserActivity {
  id: string;
  userId: string;
  username: string;
  activityType: string;
  activityTypeDescription: string;
  title: string;
  description: string;
  resourceId: string;
  resourceType: string;
  activityTime: string;
  formattedActivityTime: string;
  module: string;
}

/**
 * 获取用户最近活动
 * 
 * @param userId 用户ID
 * @param page 页码
 * @param size 每页大小
 * @returns 用户活动列表
 */
export const getUserRecentActivities = async (userId: string, page: number = 0, size: number = 10): Promise<StandardApiResponse<UserActivity[]>> => {
  try {
    const response = await axios.get<UserActivity[]>(`/api/activities/recent`, {
      params: { userId, page, size }
    });
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<UserActivity[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取用户最近活动成功',
      data: response || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<UserActivity[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取用户最近活动失败',
      data: []
    };
  }
};

/**
 * 获取用户特定类型的活动
 * 
 * @param userId 用户ID
 * @param activityType 活动类型
 * @param page 页码
 * @param size 每页大小
 * @returns 用户活动列表
 */
export const getUserActivitiesByType = async (
  userId: string, 
  activityType: string, 
  page: number = 0, 
  size: number = 10
): Promise<StandardApiResponse<UserActivity[]>> => {
  try {
    const response = await axios.get<UserActivity[]>(`/api/activities/by-type`, {
      params: { userId, activityType, page, size }
    });
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<UserActivity[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取用户特定类型活动成功',
      data: response || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<UserActivity[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取用户特定类型活动失败',
      data: []
    };
  }
};

/**
 * 获取用户在特定时间范围内的活动
 * 
 * @param userId 用户ID
 * @param startTime 开始时间（毫秒时间戳）
 * @param endTime 结束时间（毫秒时间戳）
 * @param page 页码
 * @param size 每页大小
 * @returns 用户活动列表
 */
export const getUserActivitiesByTimeRange = async (
  userId: string, 
  startTime: number, 
  endTime: number, 
  page: number = 0, 
  size: number = 10
): Promise<StandardApiResponse<UserActivity[]>> => {
  try {
    const response = await axios.get<UserActivity[]>(`/api/activities/by-time-range`, {
      params: { userId, startTime, endTime, page, size }
    });
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<UserActivity[]>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '获取用户时间范围内活动成功',
      data: response || []
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<UserActivity[]>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '获取用户时间范围内活动失败',
      data: []
    };
  }
};

/**
 * 统计用户特定类型活动的数量
 * 
 * @param userId 用户ID
 * @param activityType 活动类型
 * @returns 活动数量
 */
export const countUserActivitiesByType = async (userId: string, activityType: string): Promise<StandardApiResponse<number>> => {
  try {
    const response = await axios.get<number>(`/api/activities/count-by-type`, {
      params: { userId, activityType }
    });
    // 检查响应是否已经是标准格式
    if (typeof response === 'object' && 'success' in response) {
      return response as StandardApiResponse<number>;
    }
    // 否则包装为标准格式
    return {
      success: true,
      message: '统计用户特定类型活动数量成功',
      data: response || 0
    };
  } catch (error: any) {
    // 检查错误是否已经是标准格式
    if (error && typeof error === 'object' && 'success' in error) {
      return error as StandardApiResponse<number>;
    }
    // 否则包装为标准格式
    return {
      success: false,
      message: error.message || '统计用户特定类型活动数量失败',
      data: 0
    };
  }
};