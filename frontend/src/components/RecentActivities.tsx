import React, { useEffect, useState } from 'react';
import { List, Card, Spin, Empty } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { UserActivity, getUserRecentActivities } from '../api/userActivityApi';
import UserActivityIcon from './UserActivityIcon';
import UserActivityModuleColor from './UserActivityModuleColor';
import UserActivityTypeTag from './UserActivityTypeTag';
import UserActivityDetail from './UserActivityDetail';
import './RecentActivities.css';

interface RecentActivitiesProps {
  userId: string;
  limit?: number;
}

/**
 * 最近活动组件
 * 用于在仪表盘页面展示用户最近的活动
 */
const RecentActivities: React.FC<RecentActivitiesProps> = ({ userId, limit = 5 }) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  useEffect(() => {
    // 不再依赖于传入的userId，直接获取活动数据
    fetchRecentActivities();
  }, [limit]);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      // 因为当前系统中的用户模块还未建立，所以使用默认的system作为userId
      const response = await getUserRecentActivities("system", 0, limit);
      setActivities(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('获取最近活动失败:', error);
      setLoading(false);
    }
  };

  const handleActivityClick = (activity: UserActivity) => {
    setSelectedActivity(activity);
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
  };

  return (
    <Card title="最近活动" variant="borderless" className="activity-card recent-activities-container" size="small" style={{ flex: 1 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : activities.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={activities}
          size="small"
          renderItem={(activity) => (
            <List.Item className="activity-item" onClick={() => handleActivityClick(activity)}>
              <List.Item.Meta
                avatar={<UserActivityIcon activityType={activity.activityType} module={activity.module} className="activity-icon" />}
                title={
                  <div className="activity-title">
                    <UserActivityModuleColor module={activity.module}>
                      {activity.title}
                    </UserActivityModuleColor>
                    <UserActivityTypeTag activityType={activity.activityType} />
                  </div>
                }
                description={
                  <div className="activity-description">
                    <span>{activity.description}</span>
                    <span className="activity-time">
                      <ClockCircleOutlined style={{ marginRight: '5px' }} />
                      {activity.formattedActivityTime}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无活动记录" />
      )}

      {/* 活动详情弹窗 */}
      <UserActivityDetail
        activity={selectedActivity}
        visible={detailVisible}
        onClose={handleDetailClose}
      />
    </Card>
  );
};

export default RecentActivities;