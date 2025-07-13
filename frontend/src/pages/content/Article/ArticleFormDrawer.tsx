import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Space, DatePicker, Select, Tag } from 'antd';
import { Article } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import dayjs from '../../../utils/dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface ArticleFormDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { 
    title: string; 
    content: string; 
    source?: string; 
    author?: string; 
    publishDate?: dayjs.Dayjs; 
    difficultyLevel: number 
  }) => void;
  initialValues?: Article;
  title: string;
}

const ArticleFormDrawer: React.FC<ArticleFormDrawerProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      // 如果是编辑模式，设置表单初始值
      if (initialValues) {
        form.setFieldsValue({
          title: initialValues.title,
          content: initialValues.content,
          source: initialValues.source || '',
          author: initialValues.author || '',
          publishDate: initialValues.publishDate ? dayjs(initialValues.publishDate, 'YYYY-MM-DD') : null,
          difficultyLevel: initialValues.difficultyLevel || 3
        });
      } else {
        // 如果是创建模式，重置表单
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  return (
    <Drawer
      title={title}
      open={visible}
      onClose={onClose}
      width={800}
      placement="right"
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入文章标题' }]}
        >
          <Input placeholder="请输入文章标题" />
        </Form.Item>
        
        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入文章内容' }]}
        >
          <TextArea 
            placeholder="请输入文章内容" 
            rows={10} 
            showCount 
          />
        </Form.Item>
        
        <div className="form-row">
          <Form.Item
            name="source"
            label="来源"
            className="form-col"
          >
            <Input placeholder="请输入文章来源" />
          </Form.Item>
          
          <Form.Item
            name="author"
            label="作者"
            className="form-col"
          >
            <Input placeholder="请输入文章作者" />
          </Form.Item>
        </div>
        
        <div className="form-row">
          <Form.Item
            name="publishDate"
            label="发布日期"
            className="form-col"
          >
            <DatePicker 
              placeholder="选择发布日期" 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD"
              allowClear
              inputReadOnly
            />
          </Form.Item>
          
          <Form.Item
            name="difficultyLevel"
            label="难度级别"
            className="form-col"
            rules={[{ required: true, message: '请选择难度级别' }]}
            initialValue={3}
          >
            <Select placeholder="请选择难度级别">
              {difficultyLevelConfigs.map(config => (
                <Option key={config.value} value={config.value}>
                  <Tag color={config.color}>{config.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default ArticleFormDrawer;