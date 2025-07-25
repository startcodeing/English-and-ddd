import React from 'react';
import { Drawer, Typography, Divider, Card, Tag } from 'antd';
import { PartOfSpeech } from '@/types';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import './markdown-styles.css';
import './PartOfSpeechDetailDrawer.css';

const { Title, Paragraph, Text } = Typography;

// 配置 MarkdownIt 以支持更多特性
const mdParser = new MarkdownIt({
  html: true,        // 启用 HTML 标签
  xhtmlOut: true,    // 使用 '/' 关闭单标签
  breaks: true,      // 转换段落里的 '\n' 到 <br>
  linkify: true,     // 自动将 URL 转换为链接
  typographer: true, // 启用一些语言中立的替换 + 引号美化
  quotes: ["\u201c", "\u201d", "\u2018", "\u2019"]
});

interface PartOfSpeechDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  partOfSpeech: PartOfSpeech | null;
}

const PartOfSpeechDetailDrawer: React.FC<PartOfSpeechDetailDrawerProps> = ({
  visible,
  onClose,
  partOfSpeech
}) => {
  if (!partOfSpeech) {
    return null;
  }

  // 渲染Markdown内容
  const renderMarkdown = (content: string | undefined) => {
    if (!content) return <Text type="secondary">-</Text>;
    // 确保内容是字符串类型
    const safeContent = typeof content === 'string' ? content : '';
    return (
      <div 
        className="markdown-content" 
        dangerouslySetInnerHTML={{ __html: mdParser.render(safeContent) }}
      />
    );
  };

  // 渲染常用短语
  const renderCommonPhrases = (phrases: string[] | undefined) => {
    // 确保 phrases 是数组类型
    if (!Array.isArray(phrases) || phrases.length === 0) return <Text type="secondary">-</Text>;
    
    return (
      <div className="common-phrases">
        {phrases.map((phrase, index) => (
          <div key={index} className="phrase-item">
            {renderMarkdown(phrase)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Drawer
      title={
        <div className="drawer-header">
          <span className="drawer-title">词性详情</span>
        </div>
      }
      open={visible}
      onClose={onClose}
      width={800}
      placement="right"
      footer={null}
      className="part-of-speech-detail-drawer"
      headerStyle={{ 
        borderBottom: '1px solid #e8e8e8', 
        padding: '12px 20px',
        background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)'
      }}
      bodyStyle={{ padding: '0' }}
    >
      <div className="part-of-speech-detail">
        {/* 标题区域 */}
        <div className="title-section">
          <div className="title-content">
            <h1 className="english-name">{partOfSpeech.englishName}</h1>
            <Tag className="chinese-tag">
              {partOfSpeech.chineseMeaning}
            </Tag>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="content-sections">
          <Card className="info-card" size="small">
            <div className="section-header">
              <span className="section-title">中文含义</span>
            </div>
            <div className="section-content">
              {renderMarkdown(partOfSpeech.chineseMeaning)}
            </div>
          </Card>
          
          <Card className="info-card" size="small">
            <div className="section-header">
              <span className="section-title">用法概述</span>
            </div>
            <div className="section-content">
              {renderMarkdown(partOfSpeech.usageSummary)}
            </div>
          </Card>
          
          <Card className="info-card" size="small">
            <div className="section-header">
              <span className="section-title">常用短语</span>
            </div>
            <div className="section-content">
              {renderCommonPhrases(partOfSpeech.commonPhrases)}
            </div>
          </Card>
        </div>
      </div>
    </Drawer>
  );
};

export default PartOfSpeechDetailDrawer;