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
      >
        {practice && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID">{practice.id}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <span style={{ color: getStatusColor(practice.status) }}>
                  {getStatusText(practice.status)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(practice.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {dayjs(practice.updateTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="分数" span={2}>
                {practice.score || '未评分'}
              </Descriptions.Item>
            </Descriptions>

            {topic && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}>写作主题</Title>
                <Card>
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="主题ID">{topic.id}</Descriptions.Item>
                    <Descriptions.Item label="主题描述">{topic.description}</Descriptions.Item>
                    <Descriptions.Item label="难度级别">{topic.difficulty}</Descriptions.Item>
                    <Descriptions.Item label="时间限制">{topic.timeLimit} 分钟</Descriptions.Item>
                  </Descriptions>
                </Card>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <Title level={5}>写作内容</Title>
              <Card>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
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