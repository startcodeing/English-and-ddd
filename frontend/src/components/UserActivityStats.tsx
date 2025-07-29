import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { BookOutlined, FileTextOutlined, FormOutlined, HistoryOutlined } from '@ant-design/icons';
import { countUserActivitiesByType } from '../api/userActivityApi';

interface UserActivityStatsProps {
  userId: string;
}

/**
 * 用户活动统计组件
 * 显示用户各类活动的统计数据
 */
const UserActivityStats: React.FC<UserActivityStatsProps> = ({ userId }) => {
  const [wordCount, setWordCount] = useState<number>(0);
  const [sentenceCount, setSentenceCount] = useState<number>(0);
  const [articleCount, setArticleCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 不再依赖于传入的userId，直接使用system
    fetchActivityStats();
  }, []);

  const fetchActivityStats = async () => {
    try {
      setLoading(true);
      
      // 因为当前系统中的用户模块还未建立，所以使用默认的system作为userId
      const systemUserId = "system";
      
      // 并行获取各类统计数据
      const [wordResponse, sentenceResponse, articleResponse] = await Promise.all([
        countUserActivitiesByType(systemUserId, 'WORD_CREATED'),
        countUserActivitiesByType(systemUserId, 'SENTENCE_CREATED'),
        countUserActivitiesByType(systemUserId, 'ARTICLE_CREATED')
      ]);
      
      const wordData = wordResponse.data || 0;
      const sentenceData = sentenceResponse.data || 0;
      const articleData = articleResponse.data || 0;
      
      setWordCount(wordData);
      setSentenceCount(sentenceData);
      setArticleCount(articleData);
      setTotalCount(wordData + sentenceData + articleData);
      setLoading(false);
    } catch (error) {
      console.error('获取活动统计数据失败:', error);
      setLoading(false);
    }
  };

  return (
    <div className="user-activity-stats">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总活动数" 
              value={totalCount} 
              prefix={<HistoryOutlined />} 
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="单词学习" 
              value={wordCount} 
              prefix={<BookOutlined />} 
              loading={loading}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="句子学习" 
              value={sentenceCount} 
              prefix={<FormOutlined />} 
              loading={loading}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="文章学习" 
              value={articleCount} 
              prefix={<FileTextOutlined />} 
              loading={loading}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserActivityStats;