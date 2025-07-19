import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Button, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Sentence } from '../../../types';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './markdown-styles.css'; // 导入自定义的 Markdown 样式

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

interface SentenceFormDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { id?: number; englishContent: string; chineseMeaning: string; grammarAnalysis?: string }) => void;
  initialValues?: Sentence;
  title: string;
  mode?: 'create' | 'edit';
}

interface EditorResult {
  text: string;
  html: string;
}

const SentenceFormDrawer: React.FC<SentenceFormDrawerProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title,
  mode = 'create'
}) => {
  const [form] = Form.useForm();
  const [englishContent, setEnglishContent] = useState('');
  const [chineseMeaning, setChineseMeaning] = useState('');
  const [grammarAnalysis, setGrammarAnalysis] = useState('');

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialValues) {
        // 如果是编辑模式，设置表单初始值
        form.setFieldsValue({
          englishContent: initialValues.englishContent || '',
          chineseMeaning: initialValues.chineseMeaning || '',
          grammarAnalysis: initialValues.grammarAnalysis || ''
        });
        setEnglishContent(typeof initialValues.englishContent === 'string' ? initialValues.englishContent : '');
        setChineseMeaning(typeof initialValues.chineseMeaning === 'string' ? initialValues.chineseMeaning : '');
        setGrammarAnalysis(typeof initialValues.grammarAnalysis === 'string' ? initialValues.grammarAnalysis : '');
      } else {
        // 如果是创建模式，重置表单
        form.resetFields();
        setEnglishContent('');
        setChineseMeaning('');
        setGrammarAnalysis('');
      }
    }
  }, [visible, initialValues, form, mode]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      onSubmit({
        id: initialValues?.id ? Number(initialValues.id) : undefined,
        englishContent,
        chineseMeaning,
        grammarAnalysis
      });
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  const handleEnglishContentChange = ({ text }: EditorResult) => {
    const safeText = typeof text === 'string' ? text : '';
    setEnglishContent(safeText);
    form.setFieldsValue({ englishContent: safeText });
  };
  
  const handleChineseMeaningChange = ({ text }: EditorResult) => {
    const safeText = typeof text === 'string' ? text : '';
    setChineseMeaning(safeText);
    form.setFieldsValue({ chineseMeaning: safeText });
  };
  
  const handleGrammarAnalysisChange = ({ text }: EditorResult) => {
    const safeText = typeof text === 'string' ? text : '';
    setGrammarAnalysis(safeText);
    form.setFieldsValue({ grammarAnalysis: safeText });
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
          name="englishContent"
          label="英文内容"
          rules={[{ required: true, message: '请输入英文内容' }]}
        >
          <MdEditor
            style={{ height: '250px', width: '100%' }}
            renderHTML={text => mdParser.render(text)}
            placeholder="请输入英文内容"
            onChange={handleEnglishContentChange}
            value={typeof englishContent === 'string' ? englishContent : ''}
          />
        </Form.Item>
        
        <Form.Item
          name="chineseMeaning"
          label="中文含义"
          rules={[{ required: true, message: '请输入中文含义' }]}
        >
          <MdEditor
            style={{ height: '250px', width: '100%' }}
            renderHTML={text => mdParser.render(text)}
            placeholder="请输入中文含义"
            onChange={handleChineseMeaningChange}
            value={typeof chineseMeaning === 'string' ? chineseMeaning : ''}
          />
        </Form.Item>
        
        <Form.Item
          name="grammarAnalysis"
          label="语法分析"
          tooltip={{ title: '分析句子的语法结构，如时态、语态、从句类型等', icon: <InfoCircleOutlined /> }}
        >
          <MdEditor
            style={{ height: '300px', width: '100%' }}
            renderHTML={text => mdParser.render(text)}
            placeholder="请输入语法分析"
            onChange={handleGrammarAnalysisChange}
            value={typeof grammarAnalysis === 'string' ? grammarAnalysis : ''}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SentenceFormDrawer;
