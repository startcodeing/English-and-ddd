import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Button, Space } from 'antd';
import { BookOutlined, ReadOutlined, SoundOutlined, EditOutlined, FileTextOutlined, BookFilled, TagsOutlined, FileOutlined, AudioOutlined, TrophyOutlined, ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getAllPartOfSpeech } from '../../api/partOfSpeech';
import { getAllWords } from '../../api/word';
import { getAllWordBooks } from '../../api/wordBook';
import { getAllSentences } from '../../api/sentence';
import { getAllArticles } from '../../api/article';
import { getDictationStatistics } from '../../api/dictation';
import { getWritingStatistics } from '../../api/writing';
import { countWritingTopics } from '../../api/writingTopic';
import { getListeningMaterialsCount, countListeningMaterials } from '../../api/listeningMaterial';
import RecentActivities from '../../components/RecentActivities';
import './style.css';

const { Title, Paragraph } = Typography;

interface StatData {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  route: string;
}



const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // 初始化统计数据
  const [stats, setStats] = useState<StatData[]>([
    {
      title: '词性总数',
      value: 0,
      icon: <TagsOutlined />,
      color: '#eb2f96',
      route: '/vocabulary/part-of-speech'
    },
    {
      title: '单词总数',
      value: 0,
      icon: <BookOutlined />,
      color: '#1890ff',
      route: '/vocabulary/word'
    },
    {
      title: '单词本总数',
      value: 0,
      icon: <BookFilled />,
      color: '#13c2c2',
      route: '/vocabulary/word-book'
    },
    {
      title: '句子总数',
      value: 0,
      icon: <FileTextOutlined />,
      color: '#faad14',
      route: '/content/sentence'
    },
    {
      title: '文章总数',
      value: 0,
      icon: <ReadOutlined />,
      color: '#52c41a',
      route: '/content/article'
    },
    {
      title: '写作主题数',
      value: 0,
      icon: <FileOutlined />,
      color: '#2f54eb',
      route: '/content/writing-topics'
    },
    {
      title: '听力资料数',
      value: 0,
      icon: <AudioOutlined />,
      color: '#08979c',
      route: '/content/listening-materials/page'
    },
    {
      title: '听写总数',
      value: 0,
      icon: <SoundOutlined />,
      color: '#722ed1',
      route: '/practice/dictation'
    },
    {
      title: '写作总数',
      value: 0,
      icon: <EditOutlined />,
      color: '#fa8c16',
      route: '/practice/writing'
    }
  ]);

  // 用户信息
  const user = useSelector((state: RootState) => state.auth.user);

  // 模拟学习进度
  const [progress, setProgress] = useState({
    vocabulary: 0,
    listening: 0,
    speaking: 0,
    writing: 0
  });

  // 加载真实数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取词性总数
        const partsOfSpeechResponse = await getAllPartOfSpeech();
        const partsOfSpeechCount = partsOfSpeechResponse.data.length;
        
        // 获取单词总数
        const wordsResponse = await getAllWords();
        const wordsCount = wordsResponse.data.length;
        
        // 获取单词本总数
        const wordBooksResponse = await getAllWordBooks();
        const wordBooksCount = wordBooksResponse.data.length;
        
        // 获取句子总数
        const sentencesResponse = await getAllSentences();
        const sentencesCount = sentencesResponse.data?.length || 0;
        
        // 获取文章总数
        const articlesResponse = await getAllArticles();
        const articlesCount = articlesResponse.data.length;
        
        // 获取写作主题总数
        let writingTopicsCount = 0;
        try {
          const writingTopicsResponse = await countWritingTopics({});
          if (writingTopicsResponse.success) {
            writingTopicsCount = writingTopicsResponse.data || 0;
          }
        } catch (error) {
          console.error('获取写作主题总数失败:', error);
        }
        
        // 获取听力资料总数
        let listeningMaterialsCount = 0;
        try {
          // 尝试使用countListeningMaterials API
          const listeningMaterialsResponse = await countListeningMaterials();
          if (listeningMaterialsResponse.success) {
            listeningMaterialsCount = listeningMaterialsResponse.data || 0;
          } else {
            // 如果API调用失败，使用备选方法
            listeningMaterialsCount = await getListeningMaterialsCount();
          }
        } catch (error) {
          console.error('获取听力资料总数失败:', error);
          // 出错时尝试使用备选方法
          try {
            listeningMaterialsCount = await getListeningMaterialsCount();
          } catch (fallbackError) {
            console.error('备选方法获取听力资料总数也失败:', fallbackError);
          }
        }
        
        // 听写练习和写作练习使用模拟数据
        const dictationCount = 32;
        const writingCount = 16;
        
        // 更新统计数据
        setStats(prevStats => {
          const newStats = [...prevStats];
          // 更新词性总数
          newStats[0] = {
            ...newStats[0],
            value: partsOfSpeechCount
          };
          // 更新单词总数
          newStats[1] = {
            ...newStats[1],
            value: wordsCount
          };
          // 更新单词本总数
          newStats[2] = {
            ...newStats[2],
            value: wordBooksCount
          };
          // 更新句子总数
          newStats[3] = {
            ...newStats[3],
            value: sentencesCount
          };
          // 更新文章总数
          newStats[4] = {
            ...newStats[4],
            value: articlesCount
          };
          // 更新写作主题总数
          newStats[5] = {
            ...newStats[5],
            value: writingTopicsCount
          };
          // 更新听力资料总数
          newStats[6] = {
            ...newStats[6],
            value: listeningMaterialsCount
          };
          // 更新听写练习数量（模拟数据）
          newStats[7] = {
            ...newStats[7],
            value: dictationCount
          };
          // 更新写作练习数量（模拟数据）
          newStats[8] = {
            ...newStats[8],
            value: writingCount
          };
          return newStats;
        });

        // 最近活动通过 RecentActivities 组件获取

        // 更新学习进度（保持模拟数据）
        setProgress({
          vocabulary: 65,
          listening: 48,
          speaking: 30,
          writing: 52
        });
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* 仪表盘头部 */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-content">
            <Title level={2} className="dashboard-title">仪表盘</Title>
            <Paragraph className="dashboard-subtitle">
              欢迎回来！今天也要继续努力学习英语哦 🎯
            </Paragraph>
          </div>
          <div className="header-actions">
            <Space>
              <Button type="primary" icon={<TrophyOutlined />}>
                今日目标
              </Button>
              <Button icon={<ClockCircleOutlined />}>
                学习计划
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* 统计卡片网格 */}
      <div className="stats-grid">
        {/* 所有统计卡片放在同一行 */}
        <Row gutter={[4, 4]} className="stats-row all-stats-row" wrap={false}>
          {stats.map((stat, index) => (
            <Col flex="1" key={index}>
              <Card 
                className="enhanced-stat-card" 
                bordered={false} 
                hoverable 
                onClick={() => navigate(stat.route)}
              >
                <div className="stat-card-content">
                  <div className="stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <div className="stat-value" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="stat-title">{stat.title}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 学习进度和最近活动区域 */}
      <Row gutter={[16, 16]} className="dashboard-content-row">
        <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* 学习进度 */}
          <Card 
            title="学习进度" 
            bordered={false} 
            className="enhanced-progress-card"
            extra={<Button type="link" size="small">查看详情</Button>}
            style={{ flex: 1 }}
          >
            <div className="progress-grid">
              <div className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">词汇量</span>
                  <span className="progress-percent">{progress.vocabulary}%</span>
                </div>
                <Progress 
                  percent={progress.vocabulary} 
                  strokeColor="var(--color-primary)" 
                  showInfo={false}
                  strokeWidth={8}
                />
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">听力</span>
                  <span className="progress-percent">{progress.listening}%</span>
                </div>
                <Progress 
                  percent={progress.listening} 
                  strokeColor="var(--color-success)" 
                  showInfo={false}
                  strokeWidth={8}
                />
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">口语</span>
                  <span className="progress-percent">{progress.speaking}%</span>
                </div>
                <Progress 
                  percent={progress.speaking} 
                  strokeColor="var(--color-purple)" 
                  showInfo={false}
                  strokeWidth={8}
                />
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">写作</span>
                  <span className="progress-percent">{progress.writing}%</span>
                </div>
                <Progress 
                  percent={progress.writing} 
                  strokeColor="var(--color-orange)" 
                  showInfo={false}
                  strokeWidth={8}
                />
              </div>
            </div>
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="enhanced-activities-card" style={{ flex: 1 }}>
            <RecentActivities userId="system" limit={5} />
          </div>
        </Col>
      </Row>

      {/* 快速入口区域 */}
      <Row gutter={[16, 16]} className="quick-actions-row">
        <Col xs={24} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Card 
            title="快速入口" 
            bordered={false} 
            className="enhanced-quick-actions-card"
            extra={<Button type="link" size="small">更多功能</Button>}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Row gutter={[12, 12]} className="all-quick-actions" style={{ flex: 1, overflow: 'visible', marginBottom: '10px' }}>
              {/* 词性总数 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/vocabulary/part-of-speech')}>
                  <div className="action-icon" style={{ color: '#eb2f96' }}>
                    <TagsOutlined />
                  </div>
                  <div className="action-content">
                    <div className="action-title">词性学习</div>
                    <div className="action-desc">掌握词性知识</div>
                  </div>
                </div>
              </Col>
              {/* 单词学习 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/vocabulary/word')}>
                  <div className="action-icon" style={{ color: '#1890ff' }}>
                    <BookOutlined />
                  </div>
                  <div className="action-content">
                    <div className="action-title">单词学习</div>
                    <div className="action-desc">学习新单词</div>
                  </div>
                </div>
              </Col>
              {/* 单词本 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/vocabulary/word-book')}>
                  <div className="action-icon" style={{ color: '#13c2c2' }}>
                    <BookFilled />
                  </div>
                  <div className="action-content">
                    <div className="action-title">单词本</div>
                    <div className="action-desc">管理单词本</div>
                  </div>
                </div>
              </Col>
              {/* 句子学习 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/content/sentence')}>
                  <div className="action-icon" style={{ color: '#faad14' }}>
                    <FileTextOutlined />
                  </div>
                  <div className="action-content">
                    <div className="action-title">句子学习</div>
                    <div className="action-desc">学习句子结构</div>
                  </div>
                </div>
              </Col>
              {/* 阅读文章 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/content/article')}>
                  <div className="action-icon" style={{ color: '#52c41a' }}>
                    <ReadOutlined />
                  </div>
                  <div className="action-content">
                    <div className="action-title">阅读文章</div>
                    <div className="action-desc">提升阅读能力</div>
                  </div>
                </div>
              </Col>
              {/* 写作主题 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/content/writing-topics')}>
                  <div className="action-icon" style={{ color: '#2f54eb' }}>
                    <FileOutlined />
                  </div>
                  <div className="action-content">
                    <div className="action-title">写作主题</div>
                    <div className="action-desc">浏览写作主题</div>
                  </div>
                </div>
              </Col>
              {/* 听力资料 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/content/listening-materials/page')}>
                  <div className="action-icon" style={{ color: '#08979c' }}>
                    <AudioOutlined />
                  </div>
                  <div className="action-content">
                    <div className="action-title">听力资料</div>
                    <div className="action-desc">浏览听力资料</div>
                  </div>
                </div>
              </Col>
              {/* 听写练习 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/practice/dictation')}>
                  <div className="action-icon" style={{ color: '#722ed1' }}>
                    <SoundOutlined />
                  </div>
                  <div className="action-content">
                    <div className="action-title">听写练习</div>
                    <div className="action-desc">训练听力技能</div>
                  </div>
                </div>
              </Col>
              {/* 写作练习 */}
              <Col xs={12} sm={8} md={6} lg={4} xl={2} style={{ flex: '1 0 auto' }}>
                <div className="quick-action-item" onClick={() => navigate('/practice/writing')}>
                  <div className="action-icon" style={{ color: '#fa8c16' }}>
                    <EditOutlined />
                  </div>
                  <div className="action-content">
                    <div className="action-title">写作练习</div>
                    <div className="action-desc">提高写作水平</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;