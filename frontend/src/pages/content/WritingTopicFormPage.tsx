import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Space, Spin, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getWritingTopicById, createWritingTopic, updateWritingTopic, WritingTopic } from '../../api/writingTopic';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

type WritingTopicForm = Pick<WritingTopic, 'description' | 'source' | 'difficulty' | 'wordLimit' | 'timeLimit'>;

// 初始化Markdown解析器
const mdParser = new MarkdownIt();

const WritingTopicFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<WritingTopicForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>('');
  const isEdit = !!id;
  
  // 添加页面容器的引用，用于处理溢出问题
  const pageContainerRef = useRef<HTMLDivElement>(null);

  // 获取写作主题详情
  useEffect(() => {
    if (isEdit) {
      fetchTopicDetail();
    }
  }, [id]);

  const fetchTopicDetail = async () => {
    setLoading(true);
    try {
      const response = await getWritingTopicById(id as string);
      if (response.success && response.data) {
        const topicData = response.data;
        form.setFieldsValue({
          source: topicData.source,
          difficulty: topicData.difficulty,
          wordLimit: topicData.wordLimit,
          timeLimit: topicData.timeLimit,
        });
        // 设置富文本编辑器内容
        setEditorContent(topicData.description);
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

  // 处理编辑器内容变化
  const handleEditorChange = ({ text }: { text: string }) => {
    setEditorContent(text);
  };

  // 提交表单
  const handleSubmit = async (values: WritingTopicForm) => {
    // 验证富文本编辑器内容
    if (!editorContent.trim()) {
      message.error('请输入主题描述');
      return;
    }
    
    setSubmitting(true);
    try {
      // 将富文本编辑器内容作为description字段
      const submitData = {
        ...values,
        description: editorContent
      };
      
      let response;
      if (isEdit) {
        // 更新
        response = await updateWritingTopic(Number(id), submitData);
      } else {
        // 创建
        response = await createWritingTopic(submitData);
      }

      if (response.success) {
        message.success(`${isEdit ? '更新' : '创建'}写作主题成功`);
        navigate('/content/writing-topics');
      } else {
        message.error(response.message || `${isEdit ? '更新' : '创建'}写作主题失败`);
      }
    } catch (error) {
      console.error(`${isEdit ? '更新' : '创建'}写作主题出错:`, error);
      message.error(`${isEdit ? '更新' : '创建'}写作主题失败`);
    } finally {
      setSubmitting(false);
    }
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/content/writing-topics');
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
        title={isEdit ? '编辑写作主题' : '新增写作主题'}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              difficulty: 'medium', // 默认中等难度
            }}
          >
            <Form.Item
              label="主题描述"
              required
              validateStatus={editorContent ? 'success' : undefined}
              help={!editorContent ? '请输入主题描述' : undefined}
            >
              <MdEditor
                style={{ 
                  height: '300px', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
                renderHTML={text => mdParser.render(text)}
                onChange={handleEditorChange}
                value={editorContent}
                placeholder="请在此输入主题描述..."
              />
            </Form.Item>

          <Form.Item name="source" label="来源" rules={[{ max: 100, message: '来源最多100个字符' }]}>
            <Input placeholder="请输入来源" />
          </Form.Item>

          <Form.Item name="difficulty" label="难度级别" rules={[{ required: true, message: '请选择难度级别' }]}>
            <Select
              placeholder="请选择难度级别"
              options={[
                { value: 'easy', label: '简单' },
                { value: 'medium', label: '中等' },
                { value: 'hard', label: '困难' },
              ]}
            />
          </Form.Item>

          <Form.Item name="wordLimit" label="字数限制">
            <InputNumber
              min={1}
              max={10000}
              placeholder="请输入字数限制"
              addonAfter="字"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="timeLimit" label="时间限制">
            <InputNumber
              min={1}
              max={1440}
              placeholder="请输入时间限制"
              addonAfter="分钟"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={handleBack}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={submitting}
              >
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  </div>
  );
};

export default WritingTopicFormPage;