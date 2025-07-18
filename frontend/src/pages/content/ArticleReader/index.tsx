import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Space, Button, Divider, Tooltip, Skeleton, message } from 'antd';
import { ArrowLeftOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import { getArticleById } from '../../../api/article';
import { Article } from '../../../types/models';
import { difficultyLevelConfigs } from '../../../config/app.config';
import MarkdownIt from 'markdown-it';
import '../Article/markdown-styles.css'; // 导入Markdown样式
import './style.css';

const { Title, Text, Paragraph } = Typography;

// 配置 MarkdownIt 以支持更多特性
const mdParser = new MarkdownIt({
  html: true,        // 启用 HTML 标签
  xhtmlOut: true,    // 使用 '/' 关闭单标签
  breaks: true,      // 转换段落里的 '\n' 到 <br>
  linkify: true,     // 自动将 URL 转换为链接
  typographer: true, // 启用一些语言中立的替换 + 引号美化
  quotes: ["\u201c", "\u201d", "\u2018", "\u2019"]
});

const ArticleReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (id) {
          setLoading(true);
          const response = await getArticleById(id);
          setArticle(response.data);
        }
      } catch (error) {
        console.error('获取文章详情失败:', error);
        message.error('获取文章详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleBack = () => {
    navigate('/content/article');
  };

  const getDifficultyTag = (level: number | undefined) => {
    if (level === undefined) return null;
    const config = difficultyLevelConfigs.find(config => config.value === level);
    return config ? (
      <Tag color={config.color}>{config.label}</Tag>
    ) : null;
  };

  return (
    <div className="article-reader-container">
      <div className="article-reader-header">
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className="article-reader-back-button"
        >
          返回列表
        </Button>
      </div>

      {loading ? (
        <Card className="article-reader-card">
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      ) : article ? (
        <Card className="article-reader-card">
          <div className="article-reader-title-section">
            <Title level={2}>{article.title}</Title>
            <div className="article-reader-meta">
              {article.source && (
                <Text type="secondary" className="article-reader-source">
                  来源: {article.source}
                </Text>
              )}
              {article.author && (
                <Text type="secondary" className="article-reader-author">
                  作者: {article.author}
                </Text>
              )}
              {article.publishDate && (
                <Text type="secondary" className="article-reader-date">
                  发布日期: {article.publishDate}
                </Text>
              )}
              {getDifficultyTag(article.difficultyLevel)}
            </div>
          </div>
          
          <Divider />
          
          <div className="article-reader-content markdown-content">
            <div dangerouslySetInnerHTML={{ __html: mdParser.render(article.content || '') }} />
          </div>
          
          <Divider />
          
          <div className="article-reader-footer">
            <Space>
              {article.sentences && article.sentences.length > 0 && (
                <Tooltip title={`${article.sentences.length}个句子`}>
                  <Tag icon={<FileTextOutlined />} color="blue">
                    {article.sentences.length} 个句子
                  </Tag>
                </Tooltip>
              )}
              {article.unfamiliarWords && article.unfamiliarWords.length > 0 && (
                <Tooltip title={`${article.unfamiliarWords.length}个陌生词`}>
                  <Tag icon={<BookOutlined />} color="orange">
                    {article.unfamiliarWords.length} 个陌生词
                  </Tag>
                </Tooltip>
              )}
            </Space>
          </div>
        </Card>
      ) : (
        <Card className="article-reader-card">
          <div className="article-reader-empty">
            <Text>文章不存在或已被删除</Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ArticleReader;