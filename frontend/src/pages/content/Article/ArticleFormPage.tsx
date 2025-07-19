import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, DatePicker, Select, Tag, Card, Typography, message, Spin } from 'antd';

import { useNavigate, useParams } from 'react-router-dom';
import { Article } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import dayjs from '../../../utils/dayjs';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './markdown-styles.css'; // 导入自定义的 Markdown 样式
import './style.css';
import { createArticle, updateArticle, getArticleById } from '../../../api/article';

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

interface EditorResult {
  text: string;
  html: string;
}

const ArticleFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const pageTitle = isEditMode ? '编辑文章' : '添加文章';

  // 加载文章数据
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      getArticleById(id)
        .then((response: { data: Article }) => {
          const article = response.data;
          // 处理日期，确保只有有效的日期字符串才会被传递给 dayjs
          let publishDateValue = null;
          if (article.publishDate && typeof article.publishDate === 'string') {
            try {
              const dateObj = dayjs(article.publishDate);
              if (dateObj.isValid()) {
                publishDateValue = dateObj;
              }
            } catch (error) {
              console.error('日期解析错误:', error);
            }
          }
          
          form.setFieldsValue({
            title: article.title,
            content: article.content,
            source: article.source || '',
            author: article.author || '',
            publishDate: publishDateValue,
            difficultyLevel: article.difficultyLevel || 3
          });
          setContent(article.content || '');
        })
        .catch((error: any) => {
          console.error('获取文章数据失败:', error);
          message.error('获取文章数据失败，请重试');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // 如果是创建模式，重置表单
      form.resetFields();
      setContent('');
    }
  }, [id, form, isEditMode]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setSubmitting(true);
      // 确保content字段被包含在提交的值中
      const submitValues = {
        ...values,
        content
      };
      
      const savePromise = isEditMode
        ? updateArticle(id as string, submitValues)
        : createArticle(submitValues);
        
      savePromise
        .then(() => {
          message.success(`${isEditMode ? '更新' : '创建'}文章成功`);
          navigate('/content/article');
        })
        .catch((error: any) => {
          console.error(`${isEditMode ? '更新' : '创建'}文章失败:`, error);
          message.error(`${isEditMode ? '更新' : '创建'}文章失败，请重试`);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }).catch((error: any) => {
      console.error('表单验证失败:', error);
      message.error('表单验证失败，请检查输入');
    });
  };
  
  const handleContentChange = ({ text }: EditorResult) => {
    setContent(text);
    form.setFieldsValue({ content: text });
  };
  

  return (
    <div className="article-form-container">
      <div className="article-form-header">
        <Title level={4}>{pageTitle}</Title>
      </div>
      
      <Card className="article-form-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" tip="加载中..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            className="article-form"
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
            
            <Form.Item className="form-actions">
              <Space>
                <Button onClick={() => navigate('/content/article')} disabled={submitting}>取消</Button>
                <Button 
                  type="primary" 
                  onClick={handleSubmit} 
                  loading={submitting}
                  disabled={loading}
                >
                  {submitting ? `${isEditMode ? '更新中' : '创建中'}...` : '保存'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ArticleFormPage;