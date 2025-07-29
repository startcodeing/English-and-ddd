import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Form, Input, Select, Space, message, Typography, Progress, Row, Col, Tag } from 'antd';
import { CheckOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { createWritingPractice, getWritingPracticeById, updateWritingPractice, WritingPractice } from '../../../api/writingPractice';
import { getWritingTopics, WritingTopic } from '../../../api/writingTopic';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

// 初始化Markdown解析器
const mdParser = new MarkdownIt();

const WritingPracticeFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const isEdit = !!id;
  
  // 添加页面容器的引用，用于处理溢出问题
  const pageContainerRef = useRef<HTMLDivElement>(null);

  // 状态管理
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [topics, setTopics] = useState<WritingTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<WritingTopic | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [autoSaving, setAutoSaving] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // 获取写作主题列表
  const fetchTopics = async () => {
    try {
      const response = await getWritingTopics({});
      if (response.success) {
        setTopics(response.data || []);
      } else {
        message.error(response.message || '获取写作主题列表失败');
      }
    } catch (error) {
      console.error('获取写作主题列表出错:', error);
      message.error('获取写作主题列表失败');
    }
  };

  // 获取写作练习详情
  const fetchPracticeDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getWritingPracticeById(id);
      if (response.success && response.data) {
        const practice = response.data;
        form.setFieldsValue({
          topicId: practice.topicId,
        });
        
        // 设置富文本编辑器内容
        setEditorContent(practice.content || '');
        
        // 如果是草稿状态，获取对应的主题信息
        if (practice.status === 'draft') {
          const topicResponse = await getWritingTopics({});
          if (topicResponse.success && topicResponse.data) {
            const selectedTopic = topicResponse.data.find(topic => topic.id === practice.topicId);
            if (selectedTopic) {
              setSelectedTopic(selectedTopic);
              // 如果有时间限制，启动倒计时
              if (selectedTopic.timeLimit) {
                startTimer(selectedTopic.timeLimit * 60);
              }
            }
          }
        }
      } else {
        message.error(response.message || '获取写作练习详情失败');
        navigate('/practice/writing');
      }
    } catch (error) {
      console.error('获取写作练习详情出错:', error);
      message.error('获取写作练习详情失败');
      navigate('/practice/writing');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchTopics();
    if (isEdit) {
      fetchPracticeDetail();
    }

    // 组件卸载时清除定时器
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [id]);

  // 处理主题选择变化
  const handleTopicChange = (value: number) => {
    const topic = topics.find(t => t.id === value);
    if (topic) {
      setSelectedTopic(topic);
      // 如果有时间限制，启动倒计时
      if (topic.timeLimit) {
        startTimer(topic.timeLimit * 60);
      }
    } else {
      setSelectedTopic(null);
      stopTimer();
    }
  };

  // 启动倒计时
  const startTimer = (seconds: number) => {
    // 清除现有定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current);
    }

    setTimeLeft(seconds);
    setTimerStarted(true);

    // 设置自动保存定时器（每60秒保存一次）
    autoSaveRef.current = setInterval(() => {
      autoSave();
    }, 60000);

    // 设置倒计时定时器
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          // 时间到，自动提交
          if (prev === 1) {
            autoSubmit();
          }
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 停止倒计时
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current);
    }
    setTimeLeft(null);
    setTimerStarted(false);
  };

  // 自动保存
  const autoSave = async () => {
    const values = form.getFieldsValue();
    if (!values.topicId || !editorContent) return;

    setAutoSaving(true);
    try {
      const data: Partial<WritingPractice> = {
        topicId: values.topicId,
        content: editorContent,
        status: 'draft',
      };

      if (isEdit) {
        await updateWritingPractice(id!, data);
      } else {
        await createWritingPractice(data);
      }
    } catch (error) {
      console.error('自动保存失败:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  // 自动提交
  const autoSubmit = async () => {
    const values = form.getFieldsValue();
    if (!values.topicId || !values.content) return;

    setSubmitting(true);
    try {
      const data: Partial<WritingPractice> = {
        topicId: values.topicId,
        content: values.content,
        status: 'published',
      };

      let response;
      if (isEdit) {
        response = await updateWritingPractice(id!, data);
      } else {
        response = await createWritingPractice(data);
      }

      if (response.success) {
        message.success('时间到，写作练习已自动提交');
        navigate('/practice/writing');
      } else {
        message.error(response.message || '提交失败');
      }
    } catch (error) {
      console.error('自动提交失败:', error);
      message.error('提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 保存草稿
  const saveDraft = async () => {
    try {
      const values = await form.validateFields();
      
      // 验证富文本编辑器内容
      if (!editorContent.trim()) {
        message.error('请输入写作内容');
        return;
      }
      
      setSubmitting(true);
      const data: Partial<WritingPractice> = {
        topicId: values.topicId,
        content: editorContent,
        status: 'draft',
      };

      let response;
      if (isEdit) {
        response = await updateWritingPractice(id!, data);
      } else {
        response = await createWritingPractice(data);
      }

      if (response.success) {
        message.success('保存成功');
        if (!isEdit && response.data) {
          // 如果是新建，保存后跳转到编辑页面
          navigate(`/practice/writing/edit/${response.data.id}`);
        }
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      console.error('保存草稿失败:', error);
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 提交写作练习
  const submitPractice = async () => {
    try {
      const values = await form.validateFields();
      
      // 验证富文本编辑器内容
      if (!editorContent.trim()) {
        message.error('请输入写作内容');
        return;
      }
      
      setSubmitting(true);
      const data: Partial<WritingPractice> = {
          topicId: values.topicId,
          content: editorContent,
          status: 'submitted',
        };

      let response;
      if (isEdit) {
        response = await updateWritingPractice(id!, data);
      } else {
        response = await createWritingPractice(data);
      }

      if (response.success) {
        message.success('提交成功');
        navigate('/practice/writing');
      } else {
        message.error(response.message || '提交失败');
      }
    } catch (error) {
      console.error('提交写作练习失败:', error);
      message.error('提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 格式化倒计时显示
  const formatTimeLeft = () => {
    if (timeLeft === null) return null;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 计算倒计时进度
  const calculateProgress = () => {
    if (timeLeft === null || !selectedTopic?.timeLimit) return 0;
    const totalSeconds = selectedTopic.timeLimit * 60;
    return Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);
  };

  // 处理编辑器内容变化
  const handleEditorChange = ({ text }: { text: string }) => {
    setEditorContent(text);
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
      <Card 
        title={isEdit ? '编辑写作练习' : '新建写作练习'}
        extra={
          <Space>
            {autoSaving && <Text type="secondary">自动保存中...</Text>}
            {timeLeft !== null && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text type="danger" strong style={{ marginRight: 8 }}>
                  剩余时间: {formatTimeLeft()}
                </Text>
                <Progress 
                  type="circle" 
                  percent={calculateProgress()} 
                  width={24} 
                  format={() => ''}
                  status={timeLeft < 60 ? 'exception' : undefined}
                />
              </div>
            )}
          </Space>
        }
        bodyStyle={{ padding: 8 }}
        style={{ width: '100%', overflow: 'hidden' }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'draft' }}
          disabled={loading || submitting}
          onFinish={submitPractice}
        >
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
              
              {/* 写作主题选择区域 */}
              <Form.Item
                name="topicId"
                label={<span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>写作主题</span>}
                style={{ marginBottom: 8 }}
                rules={[{ required: true, message: '请选择写作主题' }]}
              >
                <Select
                  placeholder="请选择写作主题"
                  onChange={handleTopicChange}
                  disabled={isEdit || timerStarted}
                  style={{ width: '100%' }}
                  size="large"
                  options={topics.map(topic => ({
                    value: topic.id,
                    label: `${topic.description} (${topic.difficulty})`,
                  }))}
                />
              </Form.Item>
              
              {/* 主题信息区域 - 当有选中主题时显示 */}
              {selectedTopic && (
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
                      maxHeight: '300px', /* 增加高度，适应左侧布局 */
                      width: '100%',
                      paddingRight: '8px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#d9d9d9 #f5f5f5'
                    }}>
                      {selectedTopic.description}
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
                        <Tag color={selectedTopic.difficulty === 'easy' ? 'success' : selectedTopic.difficulty === 'medium' ? 'warning' : 'error'} style={{ 
                          fontSize: '13px', 
                          lineHeight: '20px', 
                          padding: '0 8px', 
                          margin: 0,
                          fontWeight: 500,
                          borderRadius: '4px'
                        }}>
                          {selectedTopic.difficulty}
                        </Tag>
                      </div>
                    </Col>
                    {selectedTopic.source && (
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
                            }} title={selectedTopic.source}>
                              {selectedTopic.source}
                            </Text>
                          </div>
                        </div>
                      </Col>
                    )}
                    {selectedTopic.wordLimit && (
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
                            <span style={{ color: '#1890ff', fontWeight: 600, fontSize: '15px' }}>{selectedTopic.wordLimit}</span> 字
                          </Text>
                        </div>
                      </Col>
                    )}
                    {selectedTopic.timeLimit && (
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
                            <span style={{ color: '#ff4d4f', fontWeight: 600, fontSize: '15px' }}>{selectedTopic.timeLimit}</span> 分钟
                          </Text>
                        </div>
                      </Col>
                    )}
                  </Row>
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
              <Form.Item
                label={<span style={{ fontSize: '14px', fontWeight: 500 }}>写作内容</span>}
                required
                validateStatus={editorContent ? 'success' : undefined}
                help={!editorContent && form.isFieldTouched('topicId') ? '请输入写作内容' : undefined}
                style={{ marginBottom: 8 }}
              >
                <MdEditor
                  style={{ 
                    height: '650px', 
                    border: '1px solid #d9d9d9', 
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}
                  renderHTML={text => mdParser.render(text)}
                  onChange={handleEditorChange}
                  value={editorContent}
                  placeholder="请在此输入您的写作内容..."
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'right', marginTop: 8, marginBottom: 0 }}>
          <Space size="small">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting} 
              disabled={!editorContent}
              size="middle"
              style={{ 
                minWidth: '90px',
                borderRadius: '4px',
                fontWeight: 500,
                boxShadow: '0 2px 0 rgba(0,0,0,0.045)'
              }}
              icon={<CheckOutlined />}
            >
              提交
            </Button>
            <Button 
              onClick={saveDraft} 
              loading={submitting} 
              disabled={!editorContent}
              size="middle"
              style={{ 
                minWidth: '90px',
                borderRadius: '4px',
                fontWeight: 500
              }}
              icon={<SaveOutlined />}
            >
              保存草稿
            </Button>
            <Button 
               onClick={() => navigate('/practice/writing')}
               size="middle"
               style={{ 
                 minWidth: '70px',
                 borderRadius: '4px'
               }}
               icon={<CloseOutlined />}
            >
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
    </div>
  );
};

export default WritingPracticeFormPage;