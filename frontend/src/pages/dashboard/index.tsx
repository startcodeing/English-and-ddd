import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Button, Space } from 'antd';
import { BookOutlined, ReadOutlined, SoundOutlined, EditOutlined, FileTextOutlined, BookFilled, TagsOutlined, FileOutlined, AudioOutlined, TrophyOutlined, ClockCircleOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
import { countGrammarAnalyses } from '../../api/grammarAnalysis';
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
    },
    {
      title: '语法分析数',
      value: 0,
      icon: <CheckCircleOutlined />,
      color: '#f759ab',
      route: '/content/grammar-analysis'
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
        const partsOfSpeechCount = partsOfSpeechResponse.data.data?.length || 0;
        
        // 获取单词总数
        const wordsResponse = await getAllWords();
        const wordsCount = wordsResponse.data.data?.length || 0;
        
        // 获取单词本总数
        const wordBooksResponse = await getAllWordBooks();
        const wordBooksCount = wordBooksResponse.data.data?.length || 0;
        
        // 获取句子总数
        const sentencesResponse = await getAllSentences();
        const sentencesCount = sentencesResponse.data?.length || 0;
        
        // 获取文章总数
        const articlesResponse = await getAllArticles();
        const articlesCount = articlesResponse.data?.length || 0;
        
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
        
        // 获取听写练习统计数据
        let dictationCount = 0;
        try {
          const dictationStatsResponse = await getDictationStatistics();
          if (dictationStatsResponse.success && dictationStatsResponse.data) {
            dictationCount = dictationStatsResponse.data.totalCount || 0;
          }
        } catch (error) {
          console.error('获取听写统计数据失败:', error);
          dictationCount = 32; // 使用默认值
        }
        
        // 获取写作练习统计数据
        let writingCount = 0;
        try {
          const writingStatsResponse = await getWritingStatistics();
          if (writingStatsResponse.success && writingStatsResponse.data) {
            writingCount = writingStatsResponse.data.totalCount || 0;
          }
        } catch (error) {
          console.error('获取写作统计数据失败:', error);
          writingCount = 16; // 使用默认值
        }
        
        // 获取语法分析统计数据
        let grammarAnalysisCount = 0;
        try {
          const grammarAnalysisResponse = await countGrammarAnalyses({});
          if (grammarAnalysisResponse.data.success) {
            grammarAnalysisCount = grammarAnalysisResponse.data.data || 0;
          }
        } catch (error) {
          console.error('获取语法分析统计数据失败:', error);
        }
        
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
          // 更新写作练习数量
          newStats[8] = {
            ...newStats[8],
            value: writingCount
          };
          // 更新语法分析数量
          newStats[9] = {
            ...newStats[9],
            value: grammarAnalysisCount
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
          {/*<div className="header-actions">*/}
          {/*  <Space>*/}
          {/*    <Button type="primary" icon={<TrophyOutlined />}>*/}
          {/*      今日目标*/}
          {/*    </Button>*/}
          {/*    <Button icon={<ClockCircleOutlined />}>*/}
          {/*      学习计划*/}
          {/*    </Button>*/}
          {/*  </Space>*/}
          {/*</div>*/}
        </div>
      </div>

      {/* 统计卡片网格 */}
      <div className="stats-section">
        {/* 第一行 - 5个统计卡片 */}
        <Row gutter={[16, 16]} className="stats-row">
          {stats.slice(0, 5).map((stat, index) => (
            <Col xs={24} sm={12} md={4.8} lg={4.8} xl={4.8} key={index}>
              <Card 
                className="stat-card uniform" 
                variant="borderless" 
                hoverable 
                onClick={() => navigate(stat.route)}
              >
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="stat-details">
                    <div className="stat-number" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="stat-label">{stat.title}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* 第二行 - 5个统计卡片 */}
        <Row gutter={[16, 16]} className="stats-row">
          {stats.slice(5).map((stat, index) => (
            <Col xs={24} sm={12} md={4.8} lg={4.8} xl={4.8} key={index + 5}>
              <Card 
                className="stat-card uniform" 
                variant="borderless" 
                hoverable 
                onClick={() => navigate(stat.route)}
              >
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="stat-details">
                    <div className="stat-number" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="stat-label">{stat.title}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 主要内容区域 */}
      <div className="main-content-section">
        <Row gutter={[24, 24]}>
          {/* 学习进度 */}
          <Col xs={24} lg={12}>
            <Card 
              title="学习进度" 
              variant="borderless" 
              className="progress-card"
              extra={<Button type="link" size="small">查看详情</Button>}
            >
              <div className="progress-grid">
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">词汇量</span>
                    <span className="progress-percent">{progress.vocabulary}%</span>
                  </div>
                  <Progress 
                    percent={progress.vocabulary} 
                    strokeColor="#1890ff" 
                    showInfo={false}
                    size={8}
                    trailColor="#f0f0f0"
                  />
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">听力</span>
                    <span className="progress-percent">{progress.listening}%</span>
                  </div>
                  <Progress 
                    percent={progress.listening} 
                    strokeColor="#52c41a" 
                    showInfo={false}
                    size={8}
                    trailColor="#f0f0f0"
                  />
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">口语</span>
                    <span className="progress-percent">{progress.speaking}%</span>
                  </div>
                  <Progress 
                    percent={progress.speaking} 
                    strokeColor="#722ed1" 
                    showInfo={false}
                    size={8}
                    trailColor="#f0f0f0"
                  />
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">写作</span>
                    <span className="progress-percent">{progress.writing}%</span>
                  </div>
                  <Progress 
                    percent={progress.writing} 
                    strokeColor="#fa8c16" 
                    showInfo={false}
                    size={8}
                    trailColor="#f0f0f0"
                  />
                </div>
              </div>
            </Card>
          </Col>

          {/* 最近活动 */}
          <Col xs={24} lg={12}>
            <div className="activities-card">
              <RecentActivities userId="system" limit={5} />
            </div>
          </Col>
        </Row>
      </div>

      {/* 快速入口 */}
      {/*<div className="quick-actions-section">
        <Card 
          title="快速入口" 
          variant="borderless" 
          className="quick-actions-card"
          extra={<Button type="link" size="small">更多功能</Button>}
        >
          <Row gutter={[16, 16]} className="quick-actions-grid">
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="quick-action-item" onClick={() => navigate('/vocabulary/word')}>
                <div className="action-icon">
                  <BookOutlined />
                </div>
                <div className="action-content">
                  <div className="action-title">单词学习</div>
                  <div className="action-desc">学习新单词</div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="quick-action-item" onClick={() => navigate('/content/article')}>
                <div className="action-icon">
                  <ReadOutlined />
                </div>
                <div className="action-content">
                  <div className="action-title">阅读文章</div>
                  <div className="action-desc">提升阅读能力</div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="quick-action-item" onClick={() => navigate('/practice/dictation')}>
                <div className="action-icon">
                  <SoundOutlined />
                </div>
                <div className="action-content">
                  <div className="action-title">听写练习</div>
                  <div className="action-desc">训练听力技能</div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="quick-action-item" onClick={() => navigate('/practice/writing')}>
                <div className="action-icon">
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
      </div>*/}
    </div>
  );
};

export default Dashboard;