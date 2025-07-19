import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Space, Spin, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getWritingTopicById, createWritingTopic, updateWritingTopic, WritingTopic } from '../../api/writingTopic';

type WritingTopicForm = Pick<WritingTopic, 'description' | 'source' | 'difficulty' | 'wordLimit' | 'timeLimit'>;

const WritingTopicFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<WritingTopicForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const isEdit = !!id;

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
      if (response.success) {
        const topicData = response.data;
        form.setFieldsValue({
          description: topicData.description,
          source: topicData.source,
          difficulty: topicData.difficulty,
          wordLimit: topicData.wordLimit,
          timeLimit: topicData.timeLimit,
        });
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

  // 提交表单
  const handleSubmit = async (values: WritingTopicForm) => {
    setSubmitting(true);
    try {
      let response;
      if (isEdit) {
        // 更新
        response = await updateWritingTopic(id as string, values);
      } else {
        // 创建
        response = await createWritingTopic(values);
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
    <Card
      title={isEdit ? '编辑写作主题' : '新增写作主题'}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回列表
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            difficulty: 'MEDIUM', // 默认中等难度
          }}
        >
          <Form.Item
            name="description"
            label="主题描述"
            rules={[{ required: true, message: '请输入主题描述' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入主题描述"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item name="source" label="来源" rules={[{ max: 100, message: '来源最多100个字符' }]}>
            <Input placeholder="请输入来源" />
          </Form.Item>

          <Form.Item name="difficulty" label="难度级别" rules={[{ required: true, message: '请选择难度级别' }]}>
            <Select
              placeholder="请选择难度级别"
              options={[
                { value: 'EASY', label: '简单' },
                { value: 'MEDIUM', label: '中等' },
                { value: 'HARD', label: '困难' },
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

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={submitting}
              >
                保存
              </Button>
              <Button onClick={handleBack}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default WritingTopicFormPage;