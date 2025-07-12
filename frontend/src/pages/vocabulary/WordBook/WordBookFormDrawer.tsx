import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Space } from 'antd';
import { WordBook } from '../../../types';

interface WordBookFormDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; description?: string }) => void;
  initialValues?: WordBook;
  title: string;
}

const WordBookFormDrawer: React.FC<WordBookFormDrawerProps> = ({
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
          name: initialValues.name,
          description: initialValues.description
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
      width={500}
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
          name="name"
          label="单词本名称"
          rules={[{ required: true, message: '请输入单词本名称' }]}
        >
          <Input placeholder="请输入单词本名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <Input.TextArea 
            placeholder="请输入单词本描述（选填）" 
            rows={4} 
            showCount 
            maxLength={200} 
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default WordBookFormDrawer;