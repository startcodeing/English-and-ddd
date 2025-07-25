import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Typography, Tabs, Statistic, Progress, Tag, Button, Divider, List, Badge, Empty } from 'antd';
import { UserOutlined, EditOutlined, TrophyOutlined, BookOutlined, ClockCircleOutlined, FireOutlined, DashboardOutlined, CalendarOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './ProfilePage.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface StudyStats {
  totalStudyTime: number; // 总学习时间（分钟）
  totalWords: number; // 总学习单词数
  totalSentences: number; // 总学习句子数
  totalArticles: number; // 总阅读文章数
  continuousDays: number; // 连续学习天数
  level: number; // 用户等级
  exp: number; // 当前经验值
  nextLevelExp: number; // 下一级所需经验值
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Mock数据 - 学习统计
  const [studyStats] = useState<StudyStats>({
    totalStudyTime: 1250, // 20小时50分钟
    totalWords: 856,
    totalSentences: 234,
    totalArticles: 45,
    continuousDays: 12,
    level: 5,
    exp: 2340,
    nextLevelExp: 3000
  });

  // Mock数据 - 成就系统
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      name: '初学者',
      description: '完成第一次学习',
      icon: '🎯',
      isUnlocked: true,
      unlockedAt: '2024-01-01'
    },
    {
      id: '2',
      name: '坚持者',
      description: '连续学习7天',
      icon: '🔥',
      isUnlocked: true,
      unlockedAt: '2024-01-07'
    },
    {
      id: '3',
      name: '词汇大师',
      description: '学习500个单词',
      icon: '📚',
      isUnlocked: true,
      unlockedAt: '2024-01-15'
    },
    {
      id: '4',
      name: '阅读爱好者',
      description: '阅读50篇文章',
      icon: '📖',
      isUnlocked: false,
      progress: 45,
      maxProgress: 50
    },
    {
      id: '5',
      name: '时间管理者',
      description: '累计学习100小时',
      icon: '⏰',
      isUnlocked: false,
      progress: 20,
      maxProgress: 100
    }
  ]);

  // Mock数据 - 最近学习记录
  const [recentActivities] = useState([
    {
      id: '1',
      type: '单词学习',
      content: '学习了20个新单词',
      time: '2024-01-20 14:30',
      module: 'vocabulary'
    },
    {
      id: '2',
      type: '文章阅读',
      content: '阅读了《The Future of AI》',
      time: '2024-01-20 10:15',
      module: 'content'
    },
    {
      id: '3',
      type: '听写练习',
      content: '完成了中级听写练习',
      time: '2024-01-19 16:45',
      module: 'practice'
    },
    {
      id: '4',
      type: '写作练习',
      content: '提交了议论文写作',
      time: '2024-01-19 09:20',
      module: 'practice'
    }
  ]);

  // 计算学习时间格式化
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
  };

  // 计算等级进度百分比
  const levelProgress = (studyStats.exp / studyStats.nextLevelExp) * 100;

  // 渲染概览标签页
  const renderOverviewTab = () => (
    <div className="profile-overview">
      {/* 学习统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="学习时间"
              value={formatStudyTime(studyStats.totalStudyTime)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="学习单词"
              value={studyStats.totalWords}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="连续天数"
              value={studyStats.continuousDays}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="天"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="当前等级"
              value={studyStats.level}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 等级进度 */}
      <Card title="等级进度" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Text strong style={{ marginRight: 16 }}>等级 {studyStats.level}</Text>
          <Progress 
            percent={Math.round(levelProgress)} 
            strokeColor="#1890ff"
            style={{ flex: 1 }}
          />
          <Text style={{ marginLeft: 16 }}>等级 {studyStats.level + 1}</Text>
        </div>
        <Text type="secondary">
          当前经验值: {studyStats.exp} / {studyStats.nextLevelExp} 
          (还需 {studyStats.nextLevelExp - studyStats.exp} 经验值升级)
        </Text>
      </Card>

      {/* 最近活动 */}
      <Card title="最近学习活动">
        <List
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Badge 
                    color={item.module === 'vocabulary' ? '#1890ff' : 
                           item.module === 'content' ? '#52c41a' : '#fa8c16'}
                  />
                }
                title={item.type}
                description={
                  <div>
                    <div>{item.content}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <CalendarOutlined /> {item.time}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  // 渲染成就标签页
  const renderAchievementsTab = () => (
    <div className="profile-achievements">
      <Row gutter={[16, 16]}>
        {achievements.map((achievement) => (
          <Col xs={24} sm={12} md={8} lg={6} key={achievement.id}>
            <Card 
              className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
              hoverable={achievement.isUnlocked}
            >
              <div className="achievement-content">
                <div className="achievement-icon">
                  {achievement.isUnlocked ? achievement.icon : '🔒'}
                </div>
                <Title level={5} className="achievement-name">
                  {achievement.name}
                </Title>
                <Paragraph className="achievement-description">
                  {achievement.description}
                </Paragraph>
                
                {achievement.isUnlocked ? (
                  <Tag color="green">已解锁</Tag>
                ) : (
                  <div className="achievement-progress">
                    <Progress 
                      percent={Math.round((achievement.progress! / achievement.maxProgress!) * 100)}
                      size="small"
                      strokeColor="#1890ff"
                    />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {achievement.progress} / {achievement.maxProgress}
                    </Text>
                  </div>
                )}
                
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    解锁时间: {achievement.unlockedAt}
                  </Text>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  // 渲染设置标签页
  const renderSettingsTab = () => (
    <div className="profile-settings">
      <Card title="个人信息" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>{user?.username || '用户'}</Title>
                <Text type="secondary">{user?.email || 'user@example.com'}</Text>
              </div>
              <Button type="primary" icon={<EditOutlined />} style={{ marginLeft: 'auto' }}>
                编辑资料
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="学习偏好">
        <Empty description="学习偏好设置功能开发中..." />
      </Card>
    </div>
  );

  return (
    <div className="profile-page">
      {/* 用户信息头部 */}
      <Card className="profile-header" style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col>
            <Avatar size={80} icon={<UserOutlined />} />
          </Col>
          <Col flex={1} style={{ marginLeft: 24 }}>
            <Title level={2} style={{ margin: 0 }}>
              {user?.username || '用户'}
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              {user?.email || 'user@example.com'}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">等级 {studyStats.level}</Tag>
              <Tag color="green">连续学习 {studyStats.continuousDays} 天</Tag>
            </div>
          </Col>
          <Col>
            <Button type="primary" icon={<EditOutlined />} size="large">
              编辑资料
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 标签页内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="学习概览" key="overview" icon={<DashboardOutlined />}>
            {renderOverviewTab()}
          </TabPane>
          <TabPane tab="成就系统" key="achievements" icon={<TrophyOutlined />}>
            {renderAchievementsTab()}
          </TabPane>
          <TabPane tab="个人设置" key="settings" icon={<UserOutlined />}>
            {renderSettingsTab()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage;