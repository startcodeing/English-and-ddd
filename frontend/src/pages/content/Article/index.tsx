import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Tag, Tooltip, DatePicker, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined, FileTextOutlined, DeleteColumnOutlined } from '@ant-design/icons';
import { getAllArticles, createArticle, updateArticle, deleteArticle, batchDeleteArticles } from '../../../api/article';
import { Article } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import ArticleFormDrawer from './ArticleFormDrawer';
import dayjs from '../../../utils/dayjs';
import './style.css';

const { TextArea } = Input;
const { Option } = Select;

const ArticlePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // 获取文章列表
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await getAllArticles();
      setArticles(response.data);
    } catch (error) {
      message.error('获取文章列表失败');
      console.error('获取文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchArticles();
  }, []);

  // 打开创建文章抽屉
  const handleAddArticle = () => {
    setEditingArticle(null);
    setDrawerVisible(true);
  };

  // 打开编辑文章抽屉
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setDrawerVisible(true);
  };

  // 删除文章
  const handleDeleteArticle = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？',
      onOk: async () => {
        try {
          await deleteArticle(id);
          message.success('删除成功');
          fetchArticles();
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      }
    });
  };

  // 批量删除文章
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一篇文章');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 篇文章吗？删除后将无法恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await batchDeleteArticles(selectedRowKeys as string[]);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchArticles();
        } catch (error) {
          message.error('批量删除失败，请重试');
          console.error('批量删除文章失败:', error);
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };

  // 清除选择
  const handleClearSelection = () => {
    setSelectedRowKeys([]);
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  // 保存文章（创建或更新）
  const handleSaveArticle = async (values: { 
    title: string; 
    content: string; 
    source?: string; 
    author?: string; 
    publishDate?: dayjs.Dayjs; 
    difficultyLevel: number 
  }) => {
    try {
      // 构建文章对象
      // 确保日期有效
      let formattedDate = undefined;
      if (values.publishDate) {
        // 使用dayjs内置方法验证日期，并添加时间部分以符合后端LocalDateTime格式
        formattedDate = values.publishDate.format('YYYY-MM-DD HH:mm:ss');
      }
      
      const articleData: Omit<Article, 'id'> = {
        title: values.title,
        content: values.content,
        source: values.source || undefined,
        author: values.author || undefined,
        publishDate: formattedDate,
        difficultyLevel: values.difficultyLevel,
        unfamiliarWords: [],
        sentences: []
      };
      
      if (editingArticle) {
        // 更新文章
        await updateArticle(editingArticle.id, articleData);
        message.success('更新成功');
      } else {
        // 创建文章
        await createArticle(articleData);
        message.success('创建成功');
      }
      
      setDrawerVisible(false);
      fetchArticles();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 搜索文章
  const handleSearch = async () => {
    if (!searchText) {
      fetchArticles();
      return;
    }
    
    // 在实际应用中，应该调用API进行搜索
    // 这里简单实现为前端过滤
    const filteredArticles = articles.filter(article => 
      article.title.toLowerCase().includes(searchText.toLowerCase()) ||
      article.content.toLowerCase().includes(searchText.toLowerCase()) ||
      (article.author && article.author.toLowerCase().includes(searchText.toLowerCase())) ||
      (article.source && article.source.toLowerCase().includes(searchText.toLowerCase()))
    );
    
    setArticles(filteredArticles);
  };

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="article-title">{text}</div>
        </Tooltip>
      ),
      sorter: (a: Article, b: Article) => a.title.localeCompare(b.title)
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: '30%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="article-content">{text}</div>
        </Tooltip>
      )
    },
    {
      title: '来源/作者',
      key: 'source',
      width: '15%',
      render: (_: any, record: Article) => (
        <>
          {record.source && <div className="article-source">{record.source}</div>}
          {record.author && <div className="article-author">{record.author}</div>}
        </>
      )
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: '10%',
      render: (text: string) => text || '-',
      sorter: (a: Article, b: Article) => {
        if (!a.publishDate) return -1;
        if (!b.publishDate) return 1;
        return a.publishDate.localeCompare(b.publishDate);
      }
    },
    {
      title: '难度',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: '10%',
      render: (level: number) => {
        const config = difficultyLevelConfigs.find(config => config.value === level);
        return config ? (
          <Tag color={config.color}>{config.label}</Tag>
        ) : '-';
      },
      sorter: (a: Article, b: Article) => {
        const levelA = a.difficultyLevel || 0;
        const levelB = b.difficultyLevel || 0;
        return levelA - levelB;
      }
    },
    {
      title: '关联',
      key: 'relations',
      width: '10%',
      render: (_: any, record: Article) => (
        <Space>
          {record.sentences && record.sentences.length > 0 && (
            <Tooltip title={`${record.sentences.length}个句子`}>
              <Tag icon={<FileTextOutlined />} color="blue">
                {record.sentences.length}
              </Tag>
            </Tooltip>
          )}
          {record.unfamiliarWords && record.unfamiliarWords.length > 0 && (
            <Tooltip title={`${record.unfamiliarWords.length}个陌生词`}>
              <Tag icon={<BookOutlined />} color="orange">
                {record.unfamiliarWords.length}
              </Tag>
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_: any, record: Article) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEditArticle(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteArticle(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="article-page">
      <div className="article-page-header">
        <h1>文章管理</h1>
        <div className="article-page-actions">
          <Input
            placeholder="搜索标题、内容、作者或来源"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250, marginRight: 16 }}
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddArticle}
          >
            添加文章
          </Button>
        </div>
      </div>
      
      {selectedRowKeys.length > 0 && (
        <div className="batch-actions-area">
          <span className="selected-count">
            已选择 <span className="count-number">{selectedRowKeys.length}</span> 篇文章
          </span>
          <Space>
            <Button size="small" onClick={handleClearSelection}>清除选择</Button>
            <Button
              danger
              icon={<DeleteColumnOutlined />}
              onClick={handleBatchDelete}
              loading={deleteLoading}
            >
              批量删除
            </Button>
          </Space>
        </div>
      )}
      
      <Table
        columns={columns}
        dataSource={articles}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowSelection={rowSelection}
      />
      
      <ArticleFormDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveArticle}
        initialValues={editingArticle || undefined}
        title={editingArticle ? '编辑文章' : '添加文章'}
      />
    </div>
  );
};

export default ArticlePage;