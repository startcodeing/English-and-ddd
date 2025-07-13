import React, { useEffect, useState } from 'react';
import { List, Typography, Tag, Spin, Empty, Card } from 'antd';
import { ClockCircleOutlined, BookOutlined, FileTextOutlined, FormOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserActivity as UserActivityType, getUserRecentActivities } from '../../api/userActivityApi';
import './UserRecentActivity.css';

const { Title, Text } = Typography;

// 使用从API导入的UserActivityType类型

const UserRecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<UserActivityType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // 直接获取活动数据，不再依赖于user
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      // 因为当前系统中的用户模块还未建立，所以使用默认的system作为userId
      const data = await getUserRecentActivities("system", 0, 10);
      setActivities(data);
      setLoading(false);
    } catch (error) {
      console.error('获取最近活动失败:', error);
      setLoading(false);
    }
  };

  const getActivityIcon = (module: string) => {
    switch (module) {
      case 'vocabulary':
        return <BookOutlined style={{ fontSize: '16px', color: '#1890ff' }} />;
      case 'content':
        return <FileTextOutlined style={{ fontSize: '16px', color: '#52c41a' }} />;
      case 'practice':
        return <FormOutlined style={{ fontSize: '16px', color: '#fa8c16' }} />;
      default:
        return <ClockCircleOutlined style={{ fontSize: '16px', color: '#722ed1' }} />;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'vocabulary':
        return 'blue';
      case 'content':
        return 'green';
      case 'practice':
        return 'orange';
      default:
        return 'purple';
    }
  };

  return (
    <Card className="user-activity-card" title="最近活动" extra={<a href="#">查看全部</a>}>
      {loading ? (
        <div className="activity-loading-container">
          <Spin size="large" />
        </div>
      ) : activities.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={activities}
          renderItem={(activity) => (
            <List.Item className="activity-item">
              <List.Item.Meta
                avatar={getActivityIcon(activity.module)}
                title={
                  <div className="activity-title">
                    <Text strong>{activity.title}</Text>
                    <Tag color={getModuleColor(activity.module)}>{activity.activityTypeDescription}</Tag>
                  </div>
                }
                description={
                  <div className="activity-description">
                    <Text type="secondary">{activity.description}</Text>
                    <Text type="secondary" className="activity-time">
                      <ClockCircleOutlined style={{ marginRight: '5px' }} />
                      {activity.formattedActivityTime}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无活动记录" />
      )}
    </Card>
  );
};

export default UserRecentActivity;