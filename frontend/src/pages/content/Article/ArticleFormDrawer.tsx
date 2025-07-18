import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Button, Space, DatePicker, Select, Tag, Card, Typography } from 'antd';
import { Article } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import dayjs from '../../../utils/dayjs';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './markdown-styles.css'; // 导入自定义的 Markdown 样式

const { Title, Paragraph } = Typography;

const { TextArea } = Input;
const { Option } = Select;

// 配置 MarkdownIt 以支持更多特性
const mdParser = new MarkdownIt({
  html: true,        // 启用 HTML 标签
  xhtmlOut: true,    // 使用 '/' 关闭单标签
  breaks: true,      // 转换段落里的 '\n' 到 <br>
  linkify: true,     // 自动将 URL 转换为链接
  typographer: true, // 启用一些语言中立的替换 + 引号美化
  quotes: ["\u201c", "\u201d", "\u2018", "\u2019"]
});

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
  mode?: 'create' | 'edit';
}

interface EditorResult {
  text: string;
  html: string;
}

const ArticleFormDrawer: React.FC<ArticleFormDrawerProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title,
  mode = 'create'
}) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (visible) {
      // 如果是编辑模式，设置表单初始值
      if (mode === 'edit' && initialValues) {
        // 处理日期，确保只有有效的日期字符串才会被传递给 dayjs
        let publishDateValue = null;
        if (initialValues.publishDate && typeof initialValues.publishDate === 'string') {
          try {
            // 使用 try-catch 包裹日期解析，防止无效日期导致错误
            try {
              const dateObj = dayjs(initialValues.publishDate);
              // 使用 isValid 方法检查日期是否有效
              if (dateObj.isValid()) {
                publishDateValue = dateObj;
              }
            } catch (parseError) {
              console.error('日期解析错误:', parseError);
            }
          } catch (error) {
            console.error('日期格式检查错误:', error);
          }
        }
        
        form.setFieldsValue({
          title: initialValues.title,
          content: initialValues.content,
          source: initialValues.source || '',
          author: initialValues.author || '',
          publishDate: publishDateValue,
          difficultyLevel: initialValues.difficultyLevel || 3
        });
        setContent(initialValues.content || '');
      } else {
        // 如果是创建模式，重置表单
        form.resetFields();
        setContent('');
      }
    }
  }, [visible, initialValues, form, mode]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 确保content字段被包含在提交的值中
      const submitValues = {
        ...values,
        content
      };
      onSubmit(submitValues);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };
  
  const handleContentChange = ({ text }: EditorResult) => {
    setContent(text);
    form.setFieldsValue({ content: text });
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
            <MdEditor
              style={{ height: '400px', width: '100%' }}
              renderHTML={text => mdParser.render(text)}
              placeholder="请输入文章内容"
              onChange={handleContentChange}
              value={content}
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
            getValueProps={(value) => {
              // 确保值是 dayjs 对象
              return { value: value ? dayjs(value) : null };
            }}
          >
            <DatePicker 
              placeholder="选择发布日期" 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
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