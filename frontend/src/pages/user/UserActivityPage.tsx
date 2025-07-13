import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin, Empty, Tabs, DatePicker, Select, Row, Col, Button, Divider } from 'antd';
import { ClockCircleOutlined, FilterOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { UserActivity, getUserRecentActivities, getUserActivitiesByType, getUserActivitiesByTimeRange } from '../../api/userActivityApi';
import UserActivityIcon from '../../components/UserActivityIcon';
import UserActivityModuleColor from '../../components/UserActivityModuleColor';
import UserActivityTypeTag from '../../components/UserActivityTypeTag';
import UserActivityDetail from '../../components/UserActivityDetail';
import UserActivityStats from '../../components/UserActivityStats';
import './UserActivityPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const UserActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [activityType, setActivityType] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // 不再依赖于user，直接获取活动数据
    setPage(0);
    fetchActivities();
  }, [activeTab, dateRange, activityType]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // 因为当前系统中的用户模块还未建立，所以使用默认的system作为userId
      const userId = "system";
      let data: UserActivity[] = [];
      
      // 根据筛选条件获取数据
      if (dateRange && dateRange[0] && dateRange[1]) {
        // 如果有日期范围，优先按日期范围查询
        const startTime = dateRange[0].valueOf();
        const endTime = dateRange[1].valueOf();
        data = await getUserActivitiesByTimeRange(userId, startTime, endTime, page, 20);
      } else if (activityType) {
        // 如果有活动类型筛选
        data = await getUserActivitiesByType(userId, activityType, page, 20);
      } else if (activeTab !== 'all') {
        // 如果选择了特定标签页
        data = await getUserActivitiesByType(userId, activeTab, page, 20);
      } else {
        // 默认获取最近活动
        data = await getUserRecentActivities(userId, page, 20);
      }
        
      if (data.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      if (page === 0) {
        setActivities(data);
      } else {
        setActivities(prev => [...prev, ...data]);
      }
      setLoading(false);
    } catch (error) {
      console.error('获取活动记录失败:', error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchActivities();
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(0);
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dates);
  };

  const handleActivityTypeChange = (value: string) => {
    setActivityType(value);
  };

  const handleFilter = () => {
    setPage(0);
    fetchActivities();
  };

  const resetFilters = () => {
    setDateRange(null);
    setActivityType(null);
    setPage(0);
    fetchActivities();
  };

  const handleActivityClick = (activity: UserActivity) => {
    setSelectedActivity(activity);
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
  };

  return (
    <div className="user-activity-page">
      {/* 不再依赖于user?.id，直接使用UserActivityStats组件 */}
      <UserActivityStats userId="system" />
      
      <Card className="activity-card">
        <Title level={4}>我的活动记录</Title>
        
        <Tabs activeKey={activeTab} onChange={handleTabChange} className="activity-tabs">
          <TabPane tab="全部活动" key="all" />
          <TabPane tab="词汇学习" key="WORD_CREATED" />
          <TabPane tab="内容学习" key="ARTICLE_CREATED" />
          <TabPane tab="练习活动" key="DICTATION_COMPLETED" />
        </Tabs>
        
        <Row className="filter-row" gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker 
              placeholder={['开始日期', '结束日期']} 
              style={{ width: '100%' }} 
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select 
              placeholder="选择活动类型" 
              style={{ width: '100%' }}
              allowClear
              value={activityType}
              onChange={handleActivityTypeChange}
            >
              <Option value="WORD_CREATED">创建单词</Option>
              <Option value="WORD_UPDATED">更新单词</Option>
              <Option value="WORD_MEANING_ADDED">添加释义</Option>
              <Option value="SENTENCE_CREATED">创建句子</Option>
              <Option value="ARTICLE_CREATED">创建文章</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4} lg={3}>
            <Button type="primary" icon={<FilterOutlined />} onClick={handleFilter} style={{ width: '100%' }}>筛选</Button>
          </Col>
          <Col xs={24} sm={12} md={4} lg={3}>
            <Button onClick={resetFilters} style={{ width: '100%' }}>重置</Button>
          </Col>
        </Row>
        
        {loading && page === 0 ? (
          <div className="activity-loading-container">
            <Spin size="large" />
          </div>
        ) : activities.length > 0 ? (
          <>
            <List
              itemLayout="horizontal"
              dataSource={activities}
              renderItem={(activity) => (
                <List.Item className="activity-item" onClick={() => handleActivityClick(activity)}>
                  <List.Item.Meta
                    avatar={<UserActivityIcon activityType={activity.activityType} module={activity.module} className="activity-icon" />}
                    title={
                      <div className="activity-title">
                        <UserActivityModuleColor module={activity.module}>
                          <Text strong>{activity.title}</Text>
                        </UserActivityModuleColor>
                        <UserActivityTypeTag activityType={activity.activityType} />
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
            {hasMore && (
              <div className="load-more-container">
                <Button onClick={loadMore} loading={loading && page > 0}>
                  加载更多
                </Button>
              </div>
            )}
          </>
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
    </div>
  );
};

export default UserActivityPage;