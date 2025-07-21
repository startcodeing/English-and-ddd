import React, { useEffect, useState, useRef } from 'react';
import { Card, Spin, Typography, Button, message, Row, Col, Tag, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getWritingPracticeById, WritingPractice } from '../../../api/writingPractice';
import { getWritingTopicById, WritingTopic } from '../../../api/writingTopic';
import dayjs from 'dayjs';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';

const { Title, Paragraph, Text } = Typography;

// 初始化Markdown解析器
const mdParser = new MarkdownIt();

const WritingPracticeViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // 添加页面容器的引用，用于处理溢出问题
  const pageContainerRef = useRef<HTMLDivElement>(null);
  
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
    <div 
      ref={pageContainerRef}
      style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 8px',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
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
          bodyStyle={{ padding: 8 }}
          style={{ width: '100%', overflow: 'hidden' }}
        >
          {practice && (
            <>
              {/* 左右分栏布局：左侧写作主题，右侧写作内容 */}
              <Row gutter={[8, 8]}>
                {/* 左侧：写作主题区域 */}
                <Col xs={24} sm={24} md={8} lg={7} xl={6}>
                  <div style={{ 
                    background: 'linear-gradient(120deg, #f8f9fa 0%, #e9ecef 100%)', 
                    padding: '8px 12px', 
                    borderRadius: 10, 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
                    border: '1px solid #e1e4e8',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '4px', 
                      background: 'linear-gradient(90deg, #1890ff, #52c41a)' 
                    }}></div>
                    
                    {/* 写作主题信息区域 */}
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: 600, 
                      color: '#333',
                      marginBottom: 8
                    }}>
                      写作主题
                    </div>
                    
                    {/* 主题信息区域 - 当有主题时显示 */}
                    {topic && (
                      <Card 
                        bordered={false} 
                        style={{ 
                          background: 'rgba(255,255,255,0.9)', 
                          borderRadius: 8,
                          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                          border: '1px solid rgba(232,232,232,0.8)',
                          width: '100%',
                          overflow: 'hidden',
                          marginTop: 8
                        }}
                        bodyStyle={{ 
                          padding: '8px 12px', 
                          overflow: 'hidden'
                        }}
                      >
                        {/* 主题描述 - 添加文本溢出处理 */}
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 600, 
                          marginBottom: 12, 
                          color: '#1890ff',
                          borderBottom: '1px solid #f0f0f0',
                          paddingBottom: 8,
                          display: 'flex',
                          alignItems: 'flex-start'
                        }}>
                          <div style={{ 
                            width: '4px', 
                            height: '18px', 
                            background: '#1890ff', 
                            marginRight: '8px', 
                            borderRadius: '2px',
                            flexShrink: 0,
                            marginTop: '3px'
                          }}></div>
                          <div style={{ 
                            wordBreak: 'break-word', 
                            whiteSpace: 'pre-wrap',
                            overflow: 'auto',
                            maxHeight: '300px',
                            width: '100%',
                            paddingRight: '8px',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#d9d9d9 #f5f5f5'
                          }}>
                            {topic.description}
                          </div>
                        </div>
                        
                        {/* 主题信息项 - 使用更灵活的响应式布局 */}
                        <Row gutter={[8, 8]}>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              height: '32px',
                              background: 'rgba(250,250,250,0.6)',
                              padding: '0 10px',
                              borderRadius: '6px',
                              border: '1px solid #f0f0f0'
                            }}>
                              <Text strong style={{ marginRight: 8, color: '#444', fontSize: '13px', flexShrink: 0 }}>难度</Text>
                              <Tag color={topic.difficulty === 'easy' ? 'success' : topic.difficulty === 'medium' ? 'warning' : 'error'} style={{ 
                                fontSize: '13px', 
                                lineHeight: '20px', 
                                padding: '0 8px', 
                                margin: 0,
                                fontWeight: 500,
                                borderRadius: '4px'
                              }}>
                                {topic.difficulty}
                              </Tag>
                            </div>
                          </Col>
                          {topic.source && (
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                height: '32px',
                                background: 'rgba(250,250,250,0.6)',
                                padding: '0 10px',
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0',
                                overflow: 'hidden'
                              }}>
                                <Text strong style={{ marginRight: 8, color: '#444', fontSize: '13px', flexShrink: 0 }}>来源</Text>
                                <div style={{
                                  maxWidth: 'calc(100% - 40px)',
                                  overflow: 'hidden'
                                }}>
                                  <Text italic style={{ 
                                    fontSize: '13px', 
                                    color: '#666',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block'
                                  }} title={topic.source}>
                                    {topic.source}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                          )}
                          {topic.wordLimit && (
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                height: '32px',
                                background: 'rgba(250,250,250,0.6)',
                                padding: '0 10px',
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0'
                              }}>
                                <Text strong style={{ marginRight: 8, color: '#444', fontSize: '13px', flexShrink: 0 }}>字数</Text>
                                <Text style={{ fontSize: '13px' }}>
                                  <span style={{ color: '#1890ff', fontWeight: 600, fontSize: '15px' }}>{topic.wordLimit}</span> 字
                                </Text>
                              </div>
                            </Col>
                          )}
                          {topic.timeLimit && (
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                height: '32px',
                                background: 'rgba(250,250,250,0.6)',
                                padding: '0 10px',
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0'
                              }}>
                                <Text strong style={{ marginRight: 8, color: '#444', fontSize: '13px', flexShrink: 0 }}>时间</Text>
                                <Text style={{ fontSize: '13px' }}>
                                  <span style={{ color: '#ff4d4f', fontWeight: 600, fontSize: '15px' }}>{topic.timeLimit}</span> 分钟
                                </Text>
                              </div>
                            </Col>
                          )}
                        </Row>
                        
                        {/* 练习信息 */}
                        <div style={{ 
                          marginTop: 16,
                          borderTop: '1px solid #f0f0f0',
                          paddingTop: 12
                        }}>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            marginBottom: 8, 
                            color: '#333',
                            display: 'flex',
                            alignItems: 'flex-start'
                          }}>
                            <div style={{ 
                              width: '4px', 
                              height: '16px', 
                              background: '#52c41a', 
                              marginRight: '8px', 
                              borderRadius: '2px',
                              flexShrink: 0,
                              marginTop: '3px'
                            }}></div>
                            <div>练习信息</div>
                          </div>
                          
                          <Row gutter={[8, 8]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                height: '32px',
                                background: 'rgba(250,250,250,0.6)',
                                padding: '0 10px',
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0'
                              }}>
                                <Text strong style={{ marginRight: 8, color: '#444', fontSize: '13px', flexShrink: 0 }}>状态</Text>
                                <Tag color={practice.status === 'published' ? 'success' : 'warning'} style={{ 
                                  fontSize: '13px', 
                                  lineHeight: '20px', 
                                  padding: '0 8px', 
                                  margin: 0,
                                  fontWeight: 500,
                                  borderRadius: '4px'
                                }}>
                                  {getStatusText(practice.status)}
                                </Tag>
                              </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                height: '32px',
                                background: 'rgba(250,250,250,0.6)',
                                padding: '0 10px',
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0'
                              }}>
                                <Text strong style={{ marginRight: 8, color: '#444', fontSize: '13px', flexShrink: 0 }}>创建时间</Text>
                                <Text style={{ fontSize: '13px' }}>
                                  {dayjs(practice.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                </Text>
                              </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                height: '32px',
                                background: 'rgba(250,250,250,0.6)',
                                padding: '0 10px',
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0'
                              }}>
                                <Text strong style={{ marginRight: 8, color: '#444', fontSize: '13px', flexShrink: 0 }}>更新时间</Text>
                                <Text style={{ fontSize: '13px' }}>
                                  {dayjs(practice.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                                </Text>
                              </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                height: '32px',
                                background: 'rgba(250,250,250,0.6)',
                                padding: '0 10px',
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0'
                              }}>
                                <Text strong style={{ marginRight: 8, color: '#444', fontSize: '13px', flexShrink: 0 }}>分数</Text>
                                <Text style={{ 
                                  fontSize: '13px',
                                  fontWeight: practice.score ? 'bold' : 'normal',
                                  color: practice.score ? '#1890ff' : '#999'
                                }}>
                                  {practice.score || '未评分'}
                                </Text>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    )}
                  </div>
                </Col>
                
                {/* 右侧：写作内容区域 */}
                <Col xs={24} sm={24} md={16} lg={17} xl={18}>
                  <Card
                    style={{ 
                      borderRadius: 8, 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
                      border: '1px solid #e1e4e8',
                      height: '100%'
                    }}
                    bodyStyle={{ padding: '8px 12px' }}
                  >
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 500,
                      marginBottom: 8
                    }}>
                      写作内容
                    </div>
                    <div style={{ 
                      border: '1px solid #d9d9d9', 
                      borderRadius: 4,
                      padding: '16px',
                      minHeight: '650px',
                      backgroundColor: '#fff',
                      whiteSpace: 'pre-wrap',
                      fontSize: '15px',
                      lineHeight: '1.8',
                      color: '#333',
                      overflow: 'auto'
                    }}>
                      {practice.content || '无内容'}
                    </div>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Spin>
    </div>
  );
};

export default WritingPracticeViewPage;