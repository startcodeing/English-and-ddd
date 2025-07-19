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
      title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>词性详情</span>}
      open={visible}
      onClose={onClose}
      width={900}
      placement="right"
      footer={null}
      className="part-of-speech-detail-drawer"
      headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="part-of-speech-detail">
        <Title level={2}>
          {partOfSpeech.englishName}
          <Tag color="blue" style={{ marginLeft: '12px', fontSize: '14px', padding: '0 8px' }}>
            {partOfSpeech.chineseMeaning}
          </Tag>
        </Title>
        
        <Divider orientation="left">中文含义</Divider>
        <div className="detail-section">
          {renderMarkdown(partOfSpeech.chineseMeaning)}
        </div>
        
        <Divider orientation="left">用法概述</Divider>
        <div className="detail-section">
          {renderMarkdown(partOfSpeech.usageSummary)}
        </div>
        
        <Divider orientation="left">常用短语</Divider>
        <div className="detail-section">
          {renderCommonPhrases(partOfSpeech.commonPhrases)}
        </div>
      </div>
    </Drawer>
  );
};

export default PartOfSpeechDetailDrawer;