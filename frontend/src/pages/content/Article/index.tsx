import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, message, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DeleteColumnOutlined, ReadOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllArticles, deleteArticle, batchDeleteArticles, getArticlesByPage, getArticlesByTitle, getArticlesCount } from '../../../api/article';
import { Article } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import './style.css';

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [originalArticles, setOriginalArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 处理阅读按钮点击
  const handleReadArticle = (id: string) => {
    navigate(`/content/article/read/${id}`);
  };
  


  // 获取文章列表
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await getAllArticles();
      const articleData = response.data;
      setOriginalArticles(articleData);
      setArticles(articleData);
      setPagination({
        ...pagination,
        total: articleData.length
      });
    } catch (error) {
      message.error('获取文章列表失败');
      console.error('获取文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 分页获取文章列表
  const fetchArticlesByPage = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const [articlesResponse, countResponse] = await Promise.all([
        getArticlesByPage(page, pageSize),
        getArticlesCount()
      ]);
      const articleData = articlesResponse.data;
      setOriginalArticles(articleData);
      setArticles(articleData);
      setPagination({
        ...pagination,
        current: page,
        pageSize: pageSize,
        total: countResponse.data
      });
    } catch (error) {
      message.error('获取文章列表失败');
      console.error('获取文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchArticlesByPage(pagination.current, pagination.pageSize);
  }, []);

  // 导航到创建文章页面
  const handleAddArticle = () => {
    navigate('/content/article/create');
  };

  // 导航到编辑文章页面
  const handleEditArticle = (article: Article) => {
    navigate(`/content/article/edit/${article.id}`);
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



  // 搜索文章
  const handleSearch = async () => {
    if (!searchText.trim()) {
      setArticles(originalArticles);
      setPagination({
        ...pagination,
        current: 1,
        total: originalArticles.length
      });
      return;
    }
    
    // 基于原始数据进行前端过滤搜索
    const filteredArticles = originalArticles.filter(article => 
      article.title.toLowerCase().includes(searchText.toLowerCase()) ||
      article.content.toLowerCase().includes(searchText.toLowerCase()) ||
      (article.author && article.author.toLowerCase().includes(searchText.toLowerCase())) ||
      (article.source && article.source.toLowerCase().includes(searchText.toLowerCase()))
    );
    
    setArticles(filteredArticles);
    setPagination({
      ...pagination,
      current: 1,
      total: filteredArticles.length
    });
    
    // 如果搜索结果为空，显示提示信息
    if (filteredArticles.length === 0) {
      message.info('没有找到匹配的文章');
    }
  };

  // 重置搜索
  const handleResetSearch = () => {
    setSearchText('');
    setArticles(originalArticles);
    setPagination({
      ...pagination,
      current: 1,
      total: originalArticles.length
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '18%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record: Article) => (
        <Tooltip placement="topLeft" title={text}>
          <a className="article-title" onClick={() => handleReadArticle(record.id)}>{text}</a>
        </Tooltip>
      ),
      sorter: (a: Article, b: Article) => a.title.localeCompare(b.title)
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: '32%',
      ellipsis: true,
      render: (text: string) => (
        <div className="article-content">{text}</div>
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
            size="small"
            icon={<ReadOutlined />} 
            onClick={() => handleReadArticle(record.id)}
          >
            阅读
          </Button>
          <Button 
            type="primary" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleEditArticle(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            size="small"
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
            onChange={e => {
              const value = e.target.value;
              setSearchText(value);
              // 实时搜索
              if (!value.trim()) {
                setArticles(originalArticles);
                setPagination({
                  ...pagination,
                  current: 1,
                  total: originalArticles.length
                });
              } else {
                const filteredArticles = originalArticles.filter(article => 
                  article.title.toLowerCase().includes(value.toLowerCase()) ||
                  article.content.toLowerCase().includes(value.toLowerCase()) ||
                  (article.author && article.author.toLowerCase().includes(value.toLowerCase())) ||
                  (article.source && article.source.toLowerCase().includes(value.toLowerCase()))
                );
                setArticles(filteredArticles);
                setPagination({
                  ...pagination,
                  current: 1,
                  total: filteredArticles.length
                });
              }
            }}
            onPressEnter={handleSearch}
            allowClear
            onClear={handleResetSearch}
            style={{ width: 250, marginRight: 8 }}
            prefix={<SearchOutlined />}
          />
          <Button
            onClick={handleResetSearch}
            style={{ marginRight: 16 }}
          >
            重置
          </Button>
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
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          position: ['bottomRight'],
          onChange: (page, pageSize) => {
            fetchArticlesByPage(page, pageSize || pagination.pageSize);
          },
          onShowSizeChange: (current, size) => {
            fetchArticlesByPage(1, size);
          },
          style: { marginBottom: 0 }
        }}
        rowSelection={rowSelection}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ArticlePage;