import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Button, Space } from 'antd';
import { PartOfSpeech } from '@/types';
import MarkdownIt from 'markdown-it';
import SafeMdEditor from './SafeMdEditor';
import 'react-markdown-editor-lite/lib/index.css';

const { TextArea } = Input;

// 配置 MarkdownIt 以支持更多特性
const mdParser = new MarkdownIt({
  html: true,        // 启用 HTML 标签
  xhtmlOut: true,    // 使用 '/' 关闭单标签
  breaks: true,      // 转换段落里的 '\n' 到 <br>
  linkify: true,     // 自动将 URL 转换为链接
  typographer: true, // 启用一些语言中立的替换 + 引号美化
  quotes: ["\u201c", "\u201d", "\u2018", "\u2019"]
});

interface PartOfSpeechFormDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { englishName: string; chineseMeaning: string; usageSummary?: string; commonPhrases?: string }) => void;
  initialValues?: PartOfSpeech;
  title: string;
}

interface EditorResult {
  text: string;
  html: string;
}

const PartOfSpeechFormDrawer: React.FC<PartOfSpeechFormDrawerProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title
}) => {
  const [form] = Form.useForm();
  const [usageSummary, setUsageSummary] = useState<string>('');
  const [commonPhrases, setCommonPhrases] = useState<string>('');

  useEffect(() => {
    if (visible) {
      // 如果是编辑模式，设置表单初始值
      if (initialValues) {
        // 确保 usageSummary 是字符串
        const usageSummaryValue = typeof initialValues.usageSummary === 'string' ? initialValues.usageSummary : '';
        
        // 确保 commonPhrases 是字符串
        let commonPhrasesValue = '';
        if (initialValues.commonPhrases) {
          if (Array.isArray(initialValues.commonPhrases)) {
            commonPhrasesValue = initialValues.commonPhrases.join('\n');
          } else if (typeof initialValues.commonPhrases === 'string') {
            commonPhrasesValue = initialValues.commonPhrases;
          }
        }
        
        // 先设置状态变量，确保它们是字符串类型
        setUsageSummary(usageSummaryValue);
        setCommonPhrases(commonPhrasesValue);
        
        // 然后设置表单值
        form.setFieldsValue({
          englishName: initialValues.englishName,
          chineseMeaning: initialValues.chineseMeaning,
          usageSummary: usageSummaryValue,
          commonPhrases: commonPhrasesValue
        });
      } else {
        // 如果是创建模式，重置表单
        form.resetFields();
        setUsageSummary('');
        setCommonPhrases('');
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 确保富文本内容被包含在提交的值中
      const submitValues = {
        ...values,
        usageSummary: typeof usageSummary === 'string' ? usageSummary : '',
        commonPhrases: typeof commonPhrases === 'string' ? commonPhrases : ''
      };
      onSubmit(submitValues);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };
  
  const handleUsageSummaryChange = ({ text }: EditorResult) => {
    // 确保 text 是字符串类型
    const safeText = typeof text === 'string' ? text : '';
    setUsageSummary(safeText);
    form.setFieldsValue({ usageSummary: safeText });
  };
  
  const handleCommonPhrasesChange = ({ text }: EditorResult) => {
    // 确保 text 是字符串类型
    const safeText = typeof text === 'string' ? text : '';
    setCommonPhrases(safeText);
    form.setFieldsValue({ commonPhrases: safeText });
  };

  return (
    <Drawer
      title={title}
      open={visible}
      onClose={onClose}
      width={900}
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
          <SafeMdEditor
            style={{ height: '200px', width: '100%' }}
            renderHTML={text => mdParser.render(text)}
            placeholder="请输入词性中文含义，如：名词、动词"
            onChange={({ text }: EditorResult) => {
              // 确保 text 是字符串类型
              const safeText = typeof text === 'string' ? text : '';
              form.setFieldsValue({ chineseMeaning: safeText });
            }}
            value={form.getFieldValue('chineseMeaning')}
          />
        </Form.Item>
        
        <Form.Item
          name="usageSummary"
          label="用法概述"
        >
          <SafeMdEditor
            style={{ height: '200px', width: '100%' }}
            renderHTML={text => mdParser.render(text)}
            placeholder="请输入词性用法概述"
            onChange={handleUsageSummaryChange}
            value={usageSummary}
          />
        </Form.Item>
        
        <Form.Item
          name="commonPhrases"
          label="常用短语"
          extra="每行一个短语"
        >
          <SafeMdEditor
            style={{ height: '200px', width: '100%' }}
            renderHTML={text => mdParser.render(text)}
            placeholder="请输入常用短语，每行一个"
            onChange={handleCommonPhrasesChange}
            value={commonPhrases}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PartOfSpeechFormDrawer;