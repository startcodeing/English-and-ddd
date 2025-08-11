import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Button, Divider, Tooltip, Skeleton, message, Drawer } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getSentenceById } from '../../../api/sentence';
import { getWordBySpelling, getWordDetail } from '../../../api/word';
import { Sentence, WordDetail } from '../../../types/models';
import MarkdownIt from 'markdown-it';
import '../Sentence/markdown-styles.css'; // 导入Markdown样式
import '../Sentence/sentence-reader.css'; // 导入句子阅读器样式
import WordDetailView from './WordDetailView'; // 导入单词详情视图组件
import WordDetailDrawer from '../../vocabulary/Word/WordDetailDrawer'; // 导入单词详情抽屉组件

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

const SentenceReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [wordDrawerVisible, setWordDrawerVisible] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [wordDetail, setWordDetail] = useState<WordDetail | null>(null);
  const [wordLoading, setWordLoading] = useState<boolean>(false);
  const [showAddWordDrawer, setShowAddWordDrawer] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSentence = async () => {
      try {
        if (id) {
          setLoading(true);
          const response = await getSentenceById(id);
          setSentence(response.data.data || response.data);
        }
      } catch (error) {
        console.error('获取句子详情失败:', error);
        message.error('获取句子详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchSentence();
  }, [id]);

  const handleBack = () => {
    navigate('/content/sentence');
  };
  
  // 处理单词点击事件
  const handleWordClick = async (word: string) => {
    // 清除标点符号和特殊字符
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!cleanWord) return;
    
    console.log('处理单词点击:', cleanWord);
    setSelectedWord(cleanWord);
    setWordLoading(true);
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
    } catch (error) {
      console.error('获取单词信息失败:', error);
      message.error('获取单词信息失败');
      setShowAddWordDrawer(true); // 出错时显示添加单词抽屉
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
  }, [sentence]); // 添加 sentence 作为依赖项，确保句子内容变化时重新添加事件监听
  
  // 处理英文内容渲染，将单词包装在可点击的 span 中
  const renderEnglishContent = () => {
    if (!sentence?.englishContent) return null;
    
    console.log('开始渲染句子内容');
    // 使用 MarkdownIt 渲染 Markdown 内容
    const htmlContent = mdParser.render(sentence.englishContent);
    console.log('Markdown 渲染完成');
    
    // 创建一个临时 div 元素来解析 HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // 为段落、列表项和其他文本元素添加类名，以便应用样式
    const paragraphs = tempDiv.querySelectorAll('p');
    console.log(`找到 ${paragraphs.length} 个段落`);
    paragraphs.forEach(p => {
      p.className = 'sentence-paragraph';
    });
    
    const listItems = tempDiv.querySelectorAll('li');
    console.log(`找到 ${listItems.length} 个列表项`);
    listItems.forEach(li => {
      li.className = 'sentence-list-item';
    });
    
    // 处理文本内容，将单词包装在 span 标签中以便点击
    const textNodes = Array.from(tempDiv.querySelectorAll('p, li'));
    console.log(`处理 ${textNodes.length} 个文本节点`);
    
    // 简化处理方式，直接使用 innerHTML 替换
    textNodes.forEach(node => {
      try {
        // 获取节点的 HTML 内容
        const html = node.innerHTML;
        
        // 使用 DOM 解析而不是正则表达式，以避免处理 HTML 标签内的文本
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
        
        // 递归处理所有文本节点
        const processTextNodes = (element: Element) => {
          Array.from(element.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
              // 处理文本节点
              const text = child.textContent || '';
              if (text.trim()) {
                // 创建一个包含处理后文本的文档片段
                const fragment = document.createDocumentFragment();
                
                // 分割文本并处理每个单词
                const parts = text.split(/\b/);
                parts.forEach(part => {
                  if (/^[a-zA-Z]+$/.test(part)) {
                    // 如果是英文单词，创建带有特殊类的 span
                    const span = document.createElement('span');
                    span.className = 'sentence-word';
                    span.textContent = part;
                    // 添加点击事件处理器
                    span.onclick = (e) => {
                      e.stopPropagation();
                      handleWordClick(part);
                    };
                    fragment.appendChild(span);
                  } else {
                    // 否则，直接添加文本节点
                    fragment.appendChild(document.createTextNode(part));
                  }
                });
                
                // 替换原始文本节点
                child.parentNode?.replaceChild(fragment, child);
              }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              // 递归处理子元素
              processTextNodes(child as Element);
            }
          });
        };
        
        // 处理 doc 中的所有文本节点
        processTextNodes(doc.body.firstChild as Element);
        
        // 设置节点的新 HTML 内容
        // 确保firstChild是Element类型，因为ChildNode没有innerHTML属性
        const firstChild = doc.body.firstChild as Element;
        node.innerHTML = firstChild?.innerHTML || '';
      } catch (error) {
        console.error('处理文本节点时出错:', error);
      }
    });
    
    console.log('句子内容处理完成');
    return <div dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} />;
  };

  return (
    <div className="sentence-reader-container">
      <div className="sentence-reader-header">
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className="sentence-reader-back-button"
        >
          返回列表
        </Button>
      </div>

      <div className="sentence-reader-main-content">
        {loading ? (
          <Card className="sentence-reader-card" bodyStyle={{ padding: '12px 16px' }}>
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        ) : sentence ? (
          <div>
            <Card className="sentence-reader-card" bodyStyle={{ padding: '12px 16px' }}>
              <div className="sentence-reader-title-section">
                <Typography.Title level={4} style={{ lineHeight: '1.3' }}>英文内容</Typography.Title>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div className="sentence-reader-content markdown-content" ref={contentRef}>
                {renderEnglishContent()}
              </div>
            </Card>
            
            <Card className="sentence-reader-card" bodyStyle={{ padding: '12px 16px' }} style={{ marginTop: '16px' }}>
              <div className="sentence-reader-title-section">
                <Typography.Title level={4} style={{ lineHeight: '1.3' }}>中文含义</Typography.Title>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div className="sentence-reader-content markdown-content">
                <div dangerouslySetInnerHTML={{ __html: mdParser.render(sentence.chineseMeaning || '') }} />
              </div>
            </Card>
            
            {sentence.grammarAnalysis && (
              <Card className="sentence-reader-card" bodyStyle={{ padding: '12px 16px' }} style={{ marginTop: '16px' }}>
                <div className="sentence-reader-title-section">
                  <Typography.Title level={4} style={{ lineHeight: '1.3' }}>语法分析</Typography.Title>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div className="sentence-reader-content markdown-content">
                  <div dangerouslySetInnerHTML={{ __html: mdParser.render(sentence.grammarAnalysis || '') }} />
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card className="sentence-reader-card" bodyStyle={{ padding: '12px 16px' }}>
            <div className="sentence-reader-empty">
              <Text>句子不存在或已被删除</Text>
            </div>
          </Card>
        )}
      </div>
      
      {/* 单词详情抽屉 */}
      {wordLoading ? (
        <Drawer
          title={selectedWord ? `单词详情: ${selectedWord}` : '单词详情'}
          placement="right"
          onClose={handleCloseWordDrawer}
          open={wordDrawerVisible}
          width={400}
          destroyOnClose
          zIndex={1001}
          className="word-detail-drawer"
        >
          <Skeleton active paragraph={{ rows: 10 }} />
        </Drawer>
      ) : showAddWordDrawer ? (
        // 如果单词不存在，使用 WordDetailDrawer 组件以创建模式打开
        <WordDetailDrawer
          visible={wordDrawerVisible}
          mode="create"
          onClose={handleCloseWordDrawer}
          onSuccess={() => {
            message.success(`单词 ${selectedWord} 添加成功`);
            handleCloseWordDrawer();
          }}
          initialValues={{
             spelling: selectedWord
           }} // 传递选中的单词作为初始值
        />
      ) : wordDetail ? (
        // 如果单词存在，使用 WordDetailDrawer 组件以查看模式打开
        <WordDetailDrawer
          visible={wordDrawerVisible}
          mode="view"
          wordId={wordDetail.id}
          onClose={handleCloseWordDrawer}
          onSuccess={() => {
            message.success(`单词 ${selectedWord} 更新成功`);
            handleCloseWordDrawer();
          }}
        />
      ) : (
        <Drawer
          title={selectedWord ? `单词详情: ${selectedWord}` : '单词详情'}
          placement="right"
          onClose={handleCloseWordDrawer}
          open={wordDrawerVisible}
          width={400}
          destroyOnClose
          zIndex={1001}
          className="word-detail-drawer"
        >
          <div>未找到单词信息</div>
        </Drawer>
      )}
    </div>
  );
};

export default SentenceReader;