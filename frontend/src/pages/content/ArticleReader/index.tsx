import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Space, Button, Divider, Tooltip, Skeleton, message, Drawer, Form } from 'antd';
import { ArrowLeftOutlined, BookOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getArticleById } from '../../../api/article';
import { getWordBySpelling, getWordDetail } from '../../../api/word';
import { Article, WordDetail } from '../../../types/models';
import { difficultyLevelConfigs } from '../../../config/app.config';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import '../Article/markdown-styles.css'; // 导入Markdown样式
import './style.css';
import WordDetailView from './WordDetailView';
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

const ArticleReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [wordDrawerVisible, setWordDrawerVisible] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [wordDetail, setWordDetail] = useState<WordDetail | null>(null);
  const [wordLoading, setWordLoading] = useState<boolean>(false);
  const [showAddWordDrawer, setShowAddWordDrawer] = useState<boolean>(false);
  const [sentenceDrawerVisible, setSentenceDrawerVisible] = useState<boolean>(false);
  const [selectedSentence, setSelectedSentence] = useState<string>('');
  const [sentenceForm] = Form.useForm();
  const [englishContent, setEnglishContent] = useState<string>('');
  const [chineseMeaning, setChineseMeaning] = useState<string>('');
  const [grammarAnalysis, setGrammarAnalysis] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (id) {
          setLoading(true);
          const response = await getArticleById(id);
          setArticle(response.data.data || response.data);
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
  
  // 处理选中文本添加为句子
  const handleAddSentence = (text: string) => {
    setSelectedSentence(text);
    setEnglishContent(text);
    setSentenceDrawerVisible(true);
    
    // 重置表单
    sentenceForm.resetFields();
    // 设置初始值
    sentenceForm.setFieldsValue({
      englishContent: text,
      chineseMeaning: '',
      grammarAnalysis: ''
    });
  };

  // 关闭句子添加抽屉
  const handleCloseSentenceDrawer = () => {
    setSentenceDrawerVisible(false);
    setSelectedSentence('');
    setEnglishContent('');
    setChineseMeaning('');
    setGrammarAnalysis('');
    sentenceForm.resetFields();
  };

  // 保存新句子
  const handleSaveSentence = async () => {
    try {
      // 验证表单
      await sentenceForm.validateFields();
      
      // 导入创建句子的API
      const { createSentence } = await import('../../../api/sentence');
      
      // 调用API保存句子
      await createSentence({
        englishContent: englishContent,
        chineseMeaning: chineseMeaning,
        grammarAnalysis: grammarAnalysis || ''
      });
      
      message.success('句子添加成功');
      handleCloseSentenceDrawer();
    } catch (error) {
      console.error('添加句子失败:', error);
      message.error('添加句子失败');
    }
  };
  
  // 处理富文本编辑器内容变化
  interface EditorResult {
    text: string;
    html: string;
  }
  
  const handleEnglishContentChange = ({ text }: EditorResult) => {
    setEnglishContent(text);
    sentenceForm.setFieldsValue({ englishContent: text });
  };
  
  const handleChineseMeaningChange = ({ text }: EditorResult) => {
    setChineseMeaning(text);
    sentenceForm.setFieldsValue({ chineseMeaning: text });
  };
  
  const handleGrammarAnalysisChange = ({ text }: EditorResult) => {
    setGrammarAnalysis(text);
    sentenceForm.setFieldsValue({ grammarAnalysis: text });
  };

  // 监听文章内容点击事件
  useEffect(() => {
    const handleContentClick = (e: MouseEvent) => {
      console.log('文章内容点击事件触发');
      // 获取点击的目标元素
      const target = e.target as HTMLElement;
      console.log('点击目标元素:', target.tagName, target.className);
      
      // 检查是否点击了单词 span
      if (target && target.classList.contains('article-word')) {
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
    };

    // 监听鼠标释放事件，用于处理文本选择
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const selectedText = selection.toString().trim();
        console.log('选中的文本:', selectedText);
        // 处理选中的文本，弹出句子添加抽屉
        handleAddSentence(selectedText);
      }
    };
    

    const contentElement = contentRef.current;
    if (contentElement) {
      console.log('添加事件监听器到文章内容元素');
      contentElement.addEventListener('click', handleContentClick as EventListener);
      contentElement.addEventListener('mouseup', handleMouseUp as EventListener);
    } else {
      console.warn('文章内容元素不存在，无法添加事件监听器');
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('click', handleContentClick as EventListener);
        contentElement.removeEventListener('mouseup', handleMouseUp as EventListener);
      }
    };
  }, [article]); // 添加 article 作为依赖项，确保文章内容变化时重新添加事件监听
  
  // 处理文章内容渲染，为单词添加点击事件
  const renderArticleContent = () => {
    if (!article?.content) return null;
    
    console.log('开始渲染文章内容');
    // 使用 MarkdownIt 渲染 Markdown 内容
    const htmlContent = mdParser.render(article.content);
    console.log('Markdown 渲染完成');
    
    // 创建一个临时 div 元素来解析 HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // 为段落、列表项和其他文本元素添加类名，以便应用样式
    const paragraphs = tempDiv.querySelectorAll('p');
    console.log(`找到 ${paragraphs.length} 个段落`);
    paragraphs.forEach(p => {
      p.className = 'article-paragraph';
    });
    
    const listItems = tempDiv.querySelectorAll('li');
    console.log(`找到 ${listItems.length} 个列表项`);
    listItems.forEach(li => {
      li.className = 'article-list-item';
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
                    span.className = 'article-word';
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
    
    console.log('文章内容处理完成');
    return <div dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} />;
  };

  return (
    <div className="article-reader-container">
      {loading ? (
        <Card 
          className="article-reader-card" 
          bodyStyle={{ padding: '12px 16px' }}
          title="文章详情"
          extra={
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
            >
              返回
            </Button>
          }
        >
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      ) : article ? (
        <Card 
          className="article-reader-card" 
          bodyStyle={{ padding: '12px 16px' }}
          title="文章详情"
          extra={
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
            >
              返回
            </Button>
          }
        >
          <div className="article-reader-title-section">
            <Title level={2} style={{ lineHeight: '1.3' }}>{article.title}</Title>
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
          
          <Divider style={{ margin: '8px 0' }} />
          
          <div className="article-reader-content markdown-content" ref={contentRef}>
            {renderArticleContent()}
          </div>
          
          <Divider style={{ margin: '8px 0' }} />
          
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
        <Card className="article-reader-card" bodyStyle={{ padding: '12px 16px' }}>
          <div className="article-reader-empty">
            <Text>文章不存在或已被删除</Text>
          </div>
        </Card>
      )}
      
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
        >
          <div>未找到单词信息</div>
        </Drawer>
      )}

      {/* 句子添加抽屉 */}
      <Drawer
        title="添加句子"
        placement="right"
        onClose={handleCloseSentenceDrawer}
        open={sentenceDrawerVisible}
        width={900}
        destroyOnClose
        zIndex={1002}
        extra={
          <Space>
            <Button onClick={handleCloseSentenceDrawer}>取消</Button>
            <Button type="primary" onClick={handleSaveSentence}>
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={sentenceForm}
          layout="vertical"
          initialValues={{
            englishContent: selectedSentence,
            chineseMeaning: '',
            grammarAnalysis: ''
          }}
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
              value={englishContent}
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
              value={chineseMeaning}
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
              value={grammarAnalysis}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ArticleReader;