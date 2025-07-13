import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Space } from 'antd';
import { PartOfSpeech } from '@/types';

const { TextArea } = Input;

interface PartOfSpeechFormDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { englishName: string; chineseMeaning: string; usageSummary?: string; commonPhrases?: string }) => void;
  initialValues?: PartOfSpeech;
  title: string;
}

const PartOfSpeechFormDrawer: React.FC<PartOfSpeechFormDrawerProps> = ({
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
          englishName: initialValues.englishName,
          chineseMeaning: initialValues.chineseMeaning,
          usageSummary: initialValues.usageSummary || '',
          commonPhrases: initialValues.commonPhrases ? initialValues.commonPhrases.join('\n') : ''
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
      width={600}
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
          name="englishName"
          label="英文名称"
          rules={[{ required: true, message: '请输入词性英文名称' }]}
        >
          <Input placeholder="请输入词性英文名称，如：noun, verb" />
        </Form.Item>
        
        <Form.Item
          name="chineseMeaning"
          label="中文含义"
          rules={[{ required: true, message: '请输入词性中文含义' }]}
        >
          <Input placeholder="请输入词性中文含义，如：名词、动词" />
        </Form.Item>
        
        <Form.Item
          name="usageSummary"
          label="用法概述"
        >
          <TextArea 
            placeholder="请输入词性用法概述" 
            rows={3} 
          />
        </Form.Item>
        
        <Form.Item
          name="commonPhrases"
          label="常用短语"
          extra="每行一个短语"
        >
          <TextArea 
            placeholder="请输入常用短语，每行一个" 
            rows={4} 
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PartOfSpeechFormDrawer;