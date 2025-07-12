import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Sentence } from '../../../types';

const { TextArea } = Input;

interface SentenceFormDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { englishContent: string; chineseMeaning: string; grammarAnalysis?: string }) => void;
  initialValues?: Sentence;
  title: string;
}

const SentenceFormDrawer: React.FC<SentenceFormDrawerProps> = ({
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
          englishContent: initialValues.englishContent,
          chineseMeaning: initialValues.chineseMeaning,
          grammarAnalysis: initialValues.grammarAnalysis || ''
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
      width={700}
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
          name="englishContent"
          label="英文内容"
          rules={[{ required: true, message: '请输入英文内容' }]}
        >
          <TextArea 
            placeholder="请输入英文内容" 
            rows={3} 
            showCount 
            maxLength={500}
          />
        </Form.Item>
        
        <Form.Item
          name="chineseMeaning"
          label="中文含义"
          rules={[{ required: true, message: '请输入中文含义' }]}
        >
          <TextArea 
            placeholder="请输入中文含义" 
            rows={3} 
            showCount 
            maxLength={500}
          />
        </Form.Item>
        
        <Form.Item
          name="grammarAnalysis"
          label="语法分析"
          tooltip={{ title: '分析句子的语法结构，如时态、语态、从句类型等', icon: <InfoCircleOutlined /> }}
        >
          <TextArea 
            placeholder="请输入语法分析" 
            rows={4} 
            showCount 
            maxLength={1000}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SentenceFormDrawer;