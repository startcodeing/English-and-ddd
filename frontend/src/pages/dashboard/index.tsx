import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, List, Typography } from 'antd';
import { BookOutlined, ReadOutlined, SoundOutlined, EditOutlined } from '@ant-design/icons';
import './style.css';

const { Title, Paragraph } = Typography;

interface StatData {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivity {
  id: string;
  title: string;
  type: string;
  time: string;
}

const Dashboard: React.FC = () => {
  // 模拟统计数据
  const [stats, setStats] = useState<StatData[]>([
    {
      title: '单词总数',
      value: 0,
      icon: <BookOutlined />,
      color: '#1890ff'
    },
    {
      title: '文章总数',
      value: 0,
      icon: <ReadOutlined />,
      color: '#52c41a'
    },
    {
      title: '听写练习',
      value: 0,
      icon: <SoundOutlined />,
      color: '#722ed1'
    },
    {
      title: '写作练习',
      value: 0,
      icon: <EditOutlined />,
      color: '#fa8c16'
    }
  ]);

  // 模拟最近活动
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  // 模拟学习进度
  const [progress, setProgress] = useState({
    vocabulary: 0,
    listening: 0,
    speaking: 0,
    writing: 0
  });

  // 模拟加载数据
  useEffect(() => {
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      // 更新统计数据
      setStats([
        {
          title: '单词总数',
          value: 1250,
          icon: <BookOutlined />,
          color: '#1890ff'
        },
        {
          title: '文章总数',
          value: 48,
          icon: <ReadOutlined />,
          color: '#52c41a'
        },
        {
          title: '听写练习',
          value: 32,
          icon: <SoundOutlined />,
          color: '#722ed1'
        },
        {
          title: '写作练习',
          value: 16,
          icon: <EditOutlined />,
          color: '#fa8c16'
        }
      ]);

      // 更新最近活动
      setActivities([
        {
          id: '1',
          title: '完成了"日常用语"单词本学习',
          type: '单词学习',
          time: '10分钟前'
        },
        {
          id: '2',
          title: '添加了新文章"The Importance of Reading"',
          type: '内容管理',
          time: '30分钟前'
        },
        {
          id: '3',
          title: '完成了听写练习"基础单词第一课"',
          type: '听写练习',
          time: '2小时前'
        },
        {
          id: '4',
          title: '提交了写作"My Favorite Book"',
          type: '写作练习',
          time: '昨天'
        },
        {
          id: '5',
          title: '创建了新的单词本"旅游英语"',
          type: '单词管理',
          time: '2天前'
        }
      ]);

      // 更新学习进度
      setProgress({
        vocabulary: 65,
        listening: 48,
        speaking: 30,
        writing: 52
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={2}>仪表盘</Title>
        <Paragraph>欢迎使用英语学习平台，这里是您的学习概览</Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stat-row">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className="stat-card" bordered={false}>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.color }}
                prefix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 学习进度和最近活动 */}
      <Row gutter={[16, 16]} className="detail-row">
        {/* 学习进度 */}
        <Col xs={24} md={12}>
          <Card title="学习进度" bordered={false} className="progress-card">
            <div className="progress-item">
              <span className="progress-label">词汇量</span>
              <Progress percent={progress.vocabulary} strokeColor="#1890ff" />
            </div>
            <div className="progress-item">
              <span className="progress-label">听力</span>
              <Progress percent={progress.listening} strokeColor="#52c41a" />
            </div>
            <div className="progress-item">
              <span className="progress-label">口语</span>
              <Progress percent={progress.speaking} strokeColor="#722ed1" />
            </div>
            <div className="progress-item">
              <span className="progress-label">写作</span>
              <Progress percent={progress.writing} strokeColor="#fa8c16" />
            </div>
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} md={12}>
          <Card title="最近活动" bordered={false} className="activity-card">
            <List
              itemLayout="horizontal"
              dataSource={activities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <div className="activity-meta">
                        <span className="activity-type">{item.type}</span>
                        <span className="activity-time">{item.time}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速入口 */}
      <Row gutter={[16, 16]} className="shortcut-row">
        <Col span={24}>
          <Card title="快速入口" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Card className="shortcut-card" hoverable onClick={() => window.location.href = '/vocabulary/word'}>
                  <BookOutlined className="shortcut-icon" />
                  <div className="shortcut-title">单词学习</div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card className="shortcut-card" hoverable onClick={() => window.location.href = '/content/article'}>
                  <ReadOutlined className="shortcut-icon" />
                  <div className="shortcut-title">阅读文章</div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card className="shortcut-card" hoverable onClick={() => window.location.href = '/practice/dictation'}>
                  <SoundOutlined className="shortcut-icon" />
                  <div className="shortcut-title">听写练习</div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card className="shortcut-card" hoverable onClick={() => window.location.href = '/practice/writing'}>
                  <EditOutlined className="shortcut-icon" />
                  <div className="shortcut-title">写作练习</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;