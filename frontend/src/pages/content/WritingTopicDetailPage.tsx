import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Space, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getWritingTopicById, WritingTopic } from '../../api/writingTopic';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import dayjs from 'dayjs';

// 初始化Markdown解析器
const mdParser = new MarkdownIt();

const WritingTopicDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [topic, setTopic] = useState<WritingTopic | null>(null);
  
  // 添加页面容器的引用，用于处理溢出问题
  const pageContainerRef = useRef<HTMLDivElement>(null);

  // 获取写作主题详情
  useEffect(() => {
    if (id) {
      fetchTopicDetail();
    } else {
      message.error('未指定主题ID');
      navigate('/content/writing-topics');
    }
  }, [id]);

  const fetchTopicDetail = async () => {
    setLoading(true);
    try {
      const response = await getWritingTopicById(id as string);
      if (response.success) {
        setTopic(response.data);
      } else {
        message.error(response.message || '获取写作主题详情失败');
        navigate('/content/writing-topics');
      }
    } catch (error) {
      console.error('获取写作主题详情出错:', error);
      message.error('获取写作主题详情失败');
      navigate('/content/writing-topics');
    } finally {
      setLoading(false);
    }
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/content/writing-topics');
  };

  return (
  <div ref={pageContainerRef} style={{ padding: '12px', overflow: 'auto' }}>
    <Card
      size="small"
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>写作主题详情</span>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
        </div>
      }
      bodyStyle={{ padding: '12px' }}
    >
      <Spin spinning={loading}>
        {topic && (
          <Form layout="vertical" form={form} style={{ marginBottom: 0 }}>
            <Form.Item label="主题描述" style={{ marginBottom: '12px' }}>
              <MdEditor
                style={{ 
                  height: '200px', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
                value={topic.description}
                renderHTML={text => mdParser.render(text)}
                readOnly={true}
                config={{
                  view: { menu: false, md: false, html: true },
                  canView: { menu: false, md: false, html: true, fullScreen: false, hideMenu: false }
                }}
              />
            </Form.Item>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Form.Item label="来源" style={{ marginBottom: '8px', width: 'calc(33.33% - 6px)' }}>
                  <Input value={topic.source || ''} readOnly />
                </Form.Item>
              
                <Form.Item label="难度级别" style={{ marginBottom: '8px', width: 'calc(33.33% - 6px)' }}>
                  <Select
                    value={topic.difficulty}
                    disabled
                    options={[
                      { value: 'easy', label: '简单' },
                      { value: 'medium', label: '中等' },
                      { value: 'hard', label: '困难' },
                    ]}
                  />
                </Form.Item>
              
                <Form.Item label="字数限制" style={{ marginBottom: '8px', width: 'calc(33.33% - 6px)' }}>
                  <InputNumber
                    value={topic.wordLimit}
                    disabled
                    addonAfter="字"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              
                <Form.Item label="时间限制" style={{ marginBottom: '8px', width: 'calc(33.33% - 6px)' }}>
                  <InputNumber
                    value={topic.timeLimit}
                    disabled
                    addonAfter="分钟"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              
                <Form.Item label="创建时间" style={{ marginBottom: '8px', width: 'calc(33.33% - 6px)' }}>
                  <Input value={dayjs(topic.createTime).format('YYYY-MM-DD HH:mm:ss')} readOnly />
                </Form.Item>
              
                <Form.Item label="更新时间" style={{ marginBottom: '8px', width: 'calc(33.33% - 6px)' }}>
                  <Input value={dayjs(topic.updateTime).format('YYYY-MM-DD HH:mm:ss')} readOnly />
                </Form.Item>
            </div>
          </Form>
        )}
      </Spin>
    </Card>
  </div>
  );
};

export default WritingTopicDetailPage;