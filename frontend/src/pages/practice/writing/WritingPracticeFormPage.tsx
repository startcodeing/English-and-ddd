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
          if (topicResponse.success) {
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
        if (!isEdit) {
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
      bodyStyle={{ padding: 12 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'draft' }}
        disabled={loading || submitting}
        onFinish={submitPractice}
      >
        {/* 上方小区域：写作练习详情和写作主题内容 */}
        <div style={{ marginBottom: 12, background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)', padding: '8px 10px', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e1e4e8' }}>
          <Row gutter={[16, 8]} align="middle">
            <Col xs={24} sm={24} md={8} lg={6}>
              <Form.Item
                name="topicId"
                label={<span style={{ fontSize: '14px', fontWeight: 500 }}>写作主题</span>}
                style={{ marginBottom: 4 }}
                rules={[{ required: true, message: '请选择写作主题' }]}
              >
                <Select
                  placeholder="请选择写作主题"
                  onChange={handleTopicChange}
                  disabled={isEdit || timerStarted}
                  style={{ width: '100%' }}
                  options={topics.map(topic => ({
                    value: topic.id,
                    label: `${topic.description} (${topic.difficulty})`,
                  }))}
                />
              </Form.Item>
            </Col>
            
            {selectedTopic && (
              <Col xs={24} md={16} lg={18}>
                <Card 
                  bordered={false} 
                  style={{ 
                    background: 'rgba(255,255,255,0.8)', 
                    borderRadius: 6,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  bodyStyle={{ padding: '8px 12px' }}
                >
                  <Row gutter={[12, 6]}>
                    <Col xs={24} md={24}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        marginBottom: 6, 
                        color: '#1890ff',
                        borderBottom: '1px solid #f0f0f0',
                        paddingBottom: 4
                      }}>
                        {selectedTopic.description}
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                      <div style={{ display: 'flex', alignItems: 'center', height: '24px' }}>
                        <Text strong style={{ marginRight: 4, color: '#555', fontSize: '12px' }}>难度：</Text>
                        <Tag color={selectedTopic.difficulty === 'easy' ? 'success' : selectedTopic.difficulty === 'medium' ? 'warning' : 'error'} style={{ fontSize: '12px', lineHeight: '16px', padding: '0 4px', margin: 0 }}>
                          {selectedTopic.difficulty}
                        </Tag>
                      </div>
                    </Col>
                    {selectedTopic.source && (
                      <Col xs={12} sm={6} md={6}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '24px' }}>
                          <Text strong style={{ marginRight: 4, color: '#555', fontSize: '12px' }}>来源：</Text>
                          <Text italic style={{ fontSize: '12px' }}>{selectedTopic.source}</Text>
                        </div>
                      </Col>
                    )}
                    {selectedTopic.wordLimit && (
                      <Col xs={12} sm={6} md={6}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '24px' }}>
                          <Text strong style={{ marginRight: 4, color: '#555', fontSize: '12px' }}>字数：</Text>
                          <Text style={{ fontSize: '12px' }}>
                            <span style={{ color: '#1890ff', fontWeight: 500 }}>{selectedTopic.wordLimit}</span> 字
                          </Text>
                        </div>
                      </Col>
                    )}
                    {selectedTopic.timeLimit && (
                      <Col xs={12} sm={6} md={6}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '24px' }}>
                          <Text strong style={{ marginRight: 4, color: '#555', fontSize: '12px' }}>时间：</Text>
                          <Text style={{ fontSize: '12px' }}>
                            <span style={{ color: '#ff4d4f', fontWeight: 500 }}>{selectedTopic.timeLimit}</span> 分钟
                          </Text>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>
            )}
          </Row>
        </div>
        
        {/* 下方大区域：写作内容 */}
        <Card
          style={{ 
            marginBottom: 16, 
            borderRadius: 8, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
            border: '1px solid #e1e4e8' 
          }}
          bodyStyle={{ padding: '12px 16px' }}
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
                height: '600px', 
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

        <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
          <Space size="middle">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting} 
              disabled={!editorContent}
              size="large"
              style={{ 
                minWidth: '100px',
                borderRadius: '6px',
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
              size="large"
              style={{ 
                minWidth: '100px',
                borderRadius: '6px',
                fontWeight: 500
              }}
              icon={<SaveOutlined />}
            >
              保存草稿
            </Button>
            <Button 
               onClick={() => navigate('/practice/writing')}
               size="large"
               style={{ 
                 minWidth: '80px',
                 borderRadius: '6px'
               }}
               icon={<CloseOutlined />}
            >
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default WritingPracticeFormPage;