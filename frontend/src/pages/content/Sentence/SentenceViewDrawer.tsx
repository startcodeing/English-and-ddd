import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Drawer, Typography, Divider, Skeleton, Button, message, Space } from 'antd';
import { Sentence, WordDetail } from '../../../types';
import MarkdownIt from 'markdown-it';
import './markdown-styles.css'; // 导入自定义的 Markdown 样式
import './sentence-view.css'; // 导入句子查看样式
import { getWordBySpelling, getWordDetail } from '../../../api/word';
import WordDetailView from '../SentenceReader/WordDetailView'; // 导入单词详情视图组件
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// 配置 MarkdownIt 以支持更多特性
const mdParser = new MarkdownIt({
  html: true,        // 启用 HTML 标签
  xhtmlOut: true,    // 使用 '/' 关闭单标签
  breaks: true,      // 转换段落里的 '\n' 到 <br>
  linkify: true,     // 自动将 URL 转换为链接
  typographer: true, // 启用一些语言中立的替换 + 引号美化
  quotes: ["\u201c", "\u201d", "\u2018", "\u2019"]
});

interface SentenceViewDrawerProps {
  visible: boolean;
  onClose: () => void;
  sentence?: Sentence;
  title: string;
}

const SentenceViewDrawer: React.FC<SentenceViewDrawerProps> = ({
  visible,
  onClose,
  sentence,
  title
}) => {
  const navigate = useNavigate();
  const [wordDrawerVisible, setWordDrawerVisible] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [wordDetail, setWordDetail] = useState<WordDetail | null>(null);
  const [wordLoading, setWordLoading] = useState<boolean>(false);
  const [showAddWordDrawer, setShowAddWordDrawer] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理单词点击事件
  const handleWordClick = async (word: string) => {
    // 清除标点符号和特殊字符
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!cleanWord) return;
    
    console.log('处理单词点击:', cleanWord);
    setSelectedWord(cleanWord);
    setWordLoading(true);
    // 先显示单词详情抽屉，避免用户等待
    setWordDrawerVisible(true);
    setShowAddWordDrawer(false); // 重置添加单词抽屉状态
    setWordDetail(null); // 重置单词详情
    
    try {
      // 查询单词是否存在
      console.log('开始查询单词:', cleanWord);
      const response = await getWordBySpelling(cleanWord);
      console.log('查询单词结果:', response);
      
      if (response.data && response.data.length > 0) {
        // 单词存在，获取详情
        const wordId = response.data[0].id;
        console.log('获取单词详情, ID:', wordId);
        const detailResponse = await getWordDetail(wordId);
        console.log('单词详情结果:', detailResponse);
        
        if (detailResponse.data) {
          setWordDetail(detailResponse.data.data);
          setShowAddWordDrawer(false);
        } else {
          console.error('获取单词详情失败: 返回数据为空');
          message.error('获取单词详情失败');
          setShowAddWordDrawer(true);
        }
      } else {
        // 单词不存在，显示添加单词抽屉
        console.log('单词不存在，显示添加抽屉');
        setWordDetail(null);
        setShowAddWordDrawer(true);
      }
      
      // 确保单词详情抽屉显示
      if (!wordDrawerVisible) {
        setWordDrawerVisible(true);
      }
    } catch (error) {
      console.error('获取单词信息失败:', error);
      message.error('获取单词信息失败');
      setShowAddWordDrawer(true); // 出错时显示添加单词抽屉
      
      // 即使出错也显示抽屉，让用户知道有响应
      if (!wordDrawerVisible) {
        setWordDrawerVisible(true);
      }
    } finally {
      setWordLoading(false);
    }
  };
  
  // 关闭单词详情抽屉
  const handleCloseWordDrawer = () => {
    setWordDrawerVisible(false);
    setSelectedWord('');
    setWordDetail(null);
    setShowAddWordDrawer(false);
  };
  
  // 监听句子内容点击事件
  useEffect(() => {
    // 如果抽屉不可见或没有句子内容，则不添加事件监听器
    if (!visible || !sentence) return;
    
    // 延迟添加事件监听器，确保DOM已经渲染完成
    const timeoutId = setTimeout(() => {
      const handleContentClick = (e: MouseEvent) => {
        console.log('句子内容点击事件触发');
        // 获取点击的目标元素
        const target = e.target as HTMLElement;
        console.log('点击目标元素:', target.tagName, target.className);
        
        // 检查是否点击了单词 span
        if (target && target.classList.contains('sentence-word')) {
          console.log('点击了单词元素');
          // 获取单词文本
          const wordText = target.textContent?.trim();
          console.log('单词文本:', wordText);
          if (wordText) {
            // 处理点击的单词
            handleWordClick(wordText);
            // 阻止事件冒泡，避免触发父元素的点击事件
            e.stopPropagation();
          }
          return;
        }
        
        // 如果点击的不是单词 span，检查是否有文本选择
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          const selectedText = selection.toString().trim();
          console.log('选中的文本:', selectedText);
          // 处理选中的文本
          handleWordClick(selectedText);
        }
      };

      const contentElement = contentRef.current;
      if (contentElement) {
        console.log('添加点击事件监听器到句子内容元素');
        contentElement.addEventListener('click', handleContentClick as EventListener);
      } else {
        console.warn('句子内容元素不存在，无法添加点击事件监听器');
      }

      return () => {
        if (contentElement) {
          contentElement.removeEventListener('click', handleContentClick as EventListener);
        }
      };
    }, 300); // 延迟300毫秒，确保DOM已经渲染完成
    
    return () => {
      clearTimeout(timeoutId);
      const contentElement = contentRef.current;
      if (contentElement) {
        // 移除所有可能的点击事件监听器
        // 使用新元素替换旧元素，而不是直接修改ref.current
        const clone = contentElement.cloneNode(true);
        contentElement.parentNode?.replaceChild(clone, contentElement);
        // 不直接修改contentRef.current，因为它是只读的
      }
    };
  }, [visible, sentence, handleWordClick]); // 添加 visible、sentence 和 handleWordClick 作为依赖项
  
  // 处理英文内容渲染，将单词包装在可点击的 span 中
  const renderEnglishContent = () => {
    if (!sentence?.englishContent) return <div>No content</div>;
    
    // 使用 MarkdownIt 渲染 Markdown 内容
    const renderedHtml = mdParser.render(sentence.englishContent);
    
    // 创建一个临时的 div 元素来解析 HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderedHtml;
    
    // 查找所有的段落和列表项
    const paragraphs = tempDiv.querySelectorAll('p, li');
    
    // 遍历每个段落和列表项，将英文单词包装在带有类名的 span 标签中
    paragraphs.forEach(paragraph => {
      // 获取段落的 HTML 内容
      let html = paragraph.innerHTML;
      
      // 使用正则表达式匹配英文单词，并将其包装在 span 标签中
      // 匹配英文单词，包括带有连字符和撇号的单词，但不匹配HTML标签内的内容
      html = html.replace(/(?<!<[^>]*)\b([a-zA-Z]+(?:[-'][a-zA-Z]+)*)\b(?![^<]*>)/g, 
        '<span class="sentence-word" style="cursor:pointer; display:inline-block; padding:0 2px;">$1</span>');
      
      // 更新段落的 HTML 内容
      paragraph.innerHTML = html;
    });
    
    // 返回处理后的 HTML，添加内联点击事件处理
    return (
      <div 
        className="sentence-english-content" 
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} 
        ref={contentRef} 
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('sentence-word')) {
            const wordText = target.textContent?.trim();
            if (wordText) {
              e.stopPropagation();
              handleWordClick(wordText);
            }
          }
        }}
      />
    );
  };

  // 渲染主抽屉内容
  const renderMainDrawerContent = () => (
    <div className="sentence-view-container">
      <div className="sentence-view-section">
        <Title level={4}>英文内容</Title>
        <Divider style={{ margin: '8px 0' }} />
        <div className="sentence-view-content markdown-content" ref={contentRef}>
          {renderEnglishContent()}
        </div>
      </div>
      
      <div className="sentence-view-section" style={{ marginTop: '24px' }}>
        <Title level={4}>中文含义</Title>
        <Divider style={{ margin: '8px 0' }} />
        <div className="sentence-view-content markdown-content">
          <div dangerouslySetInnerHTML={{ __html: mdParser.render(sentence?.chineseMeaning || '') }} />
        </div>
      </div>
      
      {sentence?.grammarAnalysis && (
        <div className="sentence-view-section" style={{ marginTop: '24px' }}>
          <Title level={4}>语法分析</Title>
          <Divider style={{ margin: '8px 0' }} />
          <div className="sentence-view-content markdown-content">
            <div dangerouslySetInnerHTML={{ __html: mdParser.render(sentence.grammarAnalysis || '') }} />
          </div>
        </div>
      )}
    </div>
  );
  
  // 渲染单词详情抽屉内容
  const renderWordDrawerContent = () => {
    if (wordLoading) {
      return <Skeleton active paragraph={{ rows: 10 }} />;
    } else if (wordDetail) {
      return <WordDetailView wordDetail={wordDetail} />;
    } else {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Typography.Text type="secondary">未找到单词 "{selectedWord}" 的详细信息</Typography.Text>
          <div style={{ marginTop: '16px' }}>
            <Button 
              type="primary" 
              onClick={() => {
                // 跳转到添加单词页面，并自动填充单词拼写
                navigate(`/vocabulary/word/add?spelling=${selectedWord}`);
                handleCloseWordDrawer();
              }}
            >
              添加到词库
            </Button>
          </div>
        </div>
      );
    }
  };

  // 使用状态来跟踪是否在客户端渲染
  const [isMounted, setIsMounted] = useState(false);
  
  // 确保只在客户端渲染时才使用createPortal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  return (
    <>
      {/* 主抽屉 */}
      <Drawer
        title={title}
        open={visible}
        onClose={onClose}
        width={900}
        placement="right"
        extra={<Button onClick={onClose}>关闭</Button>}
      >
        {renderMainDrawerContent()}
      </Drawer>
      
      {/* 单词详情抽屉 */}
      {isMounted ? (
        <Drawer
          title={wordDetail ? `单词详情: ${selectedWord}` : `添加新单词: ${selectedWord}`}
          placement="right"
          width={400}
          onClose={handleCloseWordDrawer}
          open={wordDrawerVisible}
          className="word-detail-drawer"
          style={{ zIndex: 1100 }}
          bodyStyle={{ padding: '16px', height: 'calc(100% - 55px)', overflowY: 'auto' }}
          getContainer={() => document.body}
        >
          {renderWordDrawerContent()}
        </Drawer>
      ) : null}
    </>
  );
};

export default SentenceViewDrawer;