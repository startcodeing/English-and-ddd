import axios from './axios';

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
export const getUserRecentActivities = async (userId: string, page: number = 0, size: number = 10): Promise<UserActivity[]> => {
  try {
    // axios拦截器已经处理了response.data，所以这里直接返回响应
    return await axios.get<UserActivity[]>(`/api/activities/recent`, {
      params: { userId, page, size }
    }) as unknown as UserActivity[];
  } catch (error) {
    console.error('获取用户最近活动失败:', error);
    throw error;
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
): Promise<UserActivity[]> => {
  try {
    // axios拦截器已经处理了response.data，所以这里直接返回响应
    return await axios.get<UserActivity[]>(`/api/activities/by-type`, {
      params: { userId, activityType, page, size }
    }) as unknown as UserActivity[];
  } catch (error) {
    console.error('获取用户特定类型活动失败:', error);
    throw error;
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
): Promise<UserActivity[]> => {
  try {
    // axios拦截器已经处理了response.data，所以这里直接返回响应
    return await axios.get<UserActivity[]>(`/api/activities/by-time-range`, {
      params: { userId, startTime, endTime, page, size }
    }) as unknown as UserActivity[];
  } catch (error) {
    console.error('获取用户时间范围内活动失败:', error);
    throw error;
  }
};

/**
 * 统计用户特定类型活动的数量
 * 
 * @param userId 用户ID
 * @param activityType 活动类型
 * @returns 活动数量
 */
export const countUserActivitiesByType = async (userId: string, activityType: string): Promise<number> => {
  try {
    // axios拦截器已经处理了response.data，所以这里直接返回响应
    return await axios.get<number>(`/api/activities/count-by-type`, {
      params: { userId, activityType }
    }) as unknown as number;
  } catch (error) {
    console.error('统计用户特定类型活动数量失败:', error);
    throw error;
  }
};