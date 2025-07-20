import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Typography, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getWritingPracticeById, WritingPractice } from '../../../api/writingPractice';
import { getWritingTopicById, WritingTopic } from '../../../api/writingTopic';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

const WritingPracticeViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [practice, setPractice] = useState<WritingPractice | null>(null);
  const [topic, setTopic] = useState<WritingTopic | null>(null);

  useEffect(() => {
    if (id) {
      fetchPracticeDetail(id);
    }
  }, [id]);

  const fetchPracticeDetail = async (practiceId: string) => {
    setLoading(true);
    try {
      const response = await getWritingPracticeById(practiceId);
      if (response.success && response.data) {
        setPractice(response.data);
        // 获取关联的写作主题
        fetchTopicDetail(response.data.topicId);
      } else {
        message.error(response.message || '获取写作练习详情失败');
      }
    } catch (error) {
      console.error('获取写作练习详情出错:', error);
      message.error('获取写作练习详情出错');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicDetail = async (topicId: number) => {
    try {
      // 使用getWritingTopicById获取单个主题详情
      const response = await getWritingTopicById(topicId);
      if (response.success && response.data) {
        setTopic(response.data);
      }
    } catch (error) {
      console.error('获取写作主题详情出错:', error);
    }
  };

  const getStatusText = (status: string) => {
    return status === 'published' ? '已提交' : '草稿';
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'green' : 'orange';
  };

  return (
    <Spin spinning={loading}>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>写作练习详情</Title>
            <Button type="primary" onClick={() => navigate('/practice/writing')}>
              返回列表
            </Button>
          </div>
        }
        bodyStyle={{ padding: 12 }}
      >
        {practice && (
          <>
            {/* 上方小区域：写作练习详情和写作主题信息 */}
            <div style={{ marginBottom: 16, background: '#f8f9fa', padding: 16, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              {topic && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ flex: '1 1 auto', minWidth: '250px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555', marginRight: 8 }}>主题描述:</span>
                      <span>{topic.description}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#555', marginRight: 8 }}>难度级别:</span>
                        <span style={{ 
                          padding: '2px 8px', 
                          borderRadius: '10px', 
                          backgroundColor: 
                            topic.difficulty === 'easy' ? 'rgba(82, 196, 26, 0.1)' : 
                            topic.difficulty === 'medium' ? 'rgba(250, 173, 20, 0.1)' : 
                            'rgba(245, 34, 45, 0.1)',
                          color: 
                            topic.difficulty === 'easy' ? '#52c41a' : 
                            topic.difficulty === 'medium' ? '#faad14' : 
                            '#f5222d'
                        }}>
                          {topic.difficulty}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#555', marginRight: 8 }}>时间限制:</span>
                        <span>{topic.timeLimit} 分钟</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', marginRight: 8 }}>状态:</span> 
                  <span style={{ 
                    color: getStatusColor(practice.status),
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backgroundColor: practice.status === 'published' ? 'rgba(82, 196, 26, 0.1)' : 'rgba(250, 173, 20, 0.1)',
                    fontSize: '14px'
                  }}>
                    {getStatusText(practice.status)}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#555', marginRight: 8 }}>创建时间:</span>
                  <span>{dayjs(practice.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#555', marginRight: 8 }}>更新时间:</span>
                  <span>{dayjs(practice.updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#555', marginRight: 8 }}>分数:</span>
                  <span style={{ 
                    fontWeight: practice.score ? 'bold' : 'normal',
                    color: practice.score ? '#1890ff' : '#999'
                  }}>
                    {practice.score || '未评分'}
                  </span>
                </div>
              </div>
            </div>

            {/* 下方大区域：写作内容 */}
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: 12, 
                color: '#333',
                borderBottom: '1px solid #eee',
                paddingBottom: 8
              }}>
                写作内容
              </div>
              <Card 
                bodyStyle={{ 
                  padding: 20, 
                  minHeight: '400px', 
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
                bordered={false}
              >
                <Paragraph 
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#333'
                  }}
                >
                  {practice.content || '无内容'}
                </Paragraph>
              </Card>
            </div>
          </>
        )}
      </Card>
    </Spin>
  );
};

export default WritingPracticeViewPage;