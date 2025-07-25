import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography } from 'antd';
import { BookOutlined, ReadOutlined, SoundOutlined, EditOutlined, FileTextOutlined, BookFilled, TagsOutlined, FileOutlined, AudioOutlined } from '@ant-design/icons';
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
        const sentencesCount = sentencesResponse.data.length;
        
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
      <div className="dashboard-header">
        <Title level={3}>仪表盘</Title>
        <Paragraph>欢迎使用英语学习平台，这里是您的学习概览</Paragraph>
      </div>

      {/* 统计卡片 - 第一行6个，第二行剩余的 */}
      <div className="stats-container">
        {/* 第一行 - 6个卡片 */}
        <Row gutter={[16, 16]} className="stat-row">
          {stats.slice(0, 6).map((stat, index) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={4} xxl={4} key={index}>
              <Card 
                className="stat-card" 
                bordered={false} 
                hoverable 
                onClick={() => navigate(stat.route)}
                size="small"
              >
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color }}
                  prefix={stat.icon}
                  formatter={(value) => <span style={{ fontSize: '16px' }}>{value}</span>}
                />
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* 第二行 - 剩余的卡片 */}
        <Row gutter={[16, 16]} className="stat-row">
          {stats.slice(6).map((stat, index) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={4} xxl={4} key={index + 6}>
              <Card 
                className="stat-card" 
                bordered={false} 
                hoverable 
                onClick={() => navigate(stat.route)}
                size="small"
              >
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color }}
                  prefix={stat.icon}
                  formatter={(value) => <span style={{ fontSize: '16px' }}>{value}</span>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 学习进度和最近活动 */}
      <Row gutter={[16, 16]} className="detail-row">
        {/* 学习进度 */}
        <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card title="学习进度" bordered={false} className="progress-card" size="small" style={{ flex: 1 }}>
            <div className="progress-item">
              <span className="progress-label">词汇量</span>
              <Progress percent={progress.vocabulary} strokeColor="#1890ff" size="small" />
            </div>
            <div className="progress-item">
              <span className="progress-label">听力</span>
              <Progress percent={progress.listening} strokeColor="#52c41a" size="small" />
            </div>
            <div className="progress-item">
              <span className="progress-label">口语</span>
              <Progress percent={progress.speaking} strokeColor="#722ed1" size="small" />
            </div>
            <div className="progress-item">
              <span className="progress-label">写作</span>
              <Progress percent={progress.writing} strokeColor="#fa8c16" size="small" />
            </div>
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* 不再依赖于user?.id，直接使用RecentActivities组件 */}
          <RecentActivities userId="system" limit={5} />
        </Col>
      </Row>

      {/* 快速入口 */}
      <Row gutter={[16, 16]} className="shortcut-row">
        <Col span={24}>
          <Card title="快速入口" bordered={false} size="small">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Card className="shortcut-card" hoverable onClick={() => navigate('/vocabulary/word')}>
                  <BookOutlined className="shortcut-icon" />
                  <div className="shortcut-title">单词学习</div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card className="shortcut-card" hoverable onClick={() => navigate('/content/article')}>
                  <ReadOutlined className="shortcut-icon" />
                  <div className="shortcut-title">阅读文章</div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card className="shortcut-card" hoverable onClick={() => navigate('/practice/dictation')}>
                  <SoundOutlined className="shortcut-icon" />
                  <div className="shortcut-title">听写练习</div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card className="shortcut-card" hoverable onClick={() => navigate('/practice/writing')}>
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