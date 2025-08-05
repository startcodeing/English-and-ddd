import React, { useState, useEffect } from 'react';
import { Tag, Tooltip, Space, Button, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReadOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllArticles, deleteArticle, batchDeleteArticles, getArticlesByPage, getArticlesByTitle, getArticlesCount } from '../../../api/article';
import { Article } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import { UnifiedListPage } from '../../../components/unified/UnifiedListPage';
import type { TableColumn, FilterOption, BatchAction } from '../../../components/unified/UnifiedListPage';

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
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
      setArticles(response.data);
      setPagination({
        ...pagination,
        total: response.data.length
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
      setArticles(articlesResponse.data);
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
  const handleBatchDelete = async () => {
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

  // 搜索文章
  const handleSearch = (searchText: string, dataSource: Article[]): Article[] => {
    if (!searchText) {
      return dataSource;
    }
    
    return dataSource.filter(article => 
      article.title.toLowerCase().includes(searchText.toLowerCase()) ||
      article.content.toLowerCase().includes(searchText.toLowerCase()) ||
      (article.author && article.author.toLowerCase().includes(searchText.toLowerCase())) ||
      (article.source && article.source.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  // 重置搜索
  const handleReset = () => {
    setSearchText('');
    fetchArticlesByPage(1, pagination.pageSize);
  };

  // 分页变化处理
  const handlePaginationChange = (page: number, pageSize?: number) => {
    fetchArticlesByPage(page, pageSize || pagination.pageSize);
  };

  // 表格列定义
  const columns: TableColumn[] = [
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
          <a className="table-link" onClick={() => handleReadArticle(record.id)}>{text}</a>
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
        <div className="table-ellipsis">{text}</div>
      )
    },
    {
      title: '来源/作者',
      dataIndex: 'source',
      key: 'source',
      width: '15%',
      render: (_: any, record: Article) => (
        <>
          {record.source && <div>{record.source}</div>}
          {record.author && <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{record.author}</div>}
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
        if (!config) return '-';
        
        const className = `status-tag difficulty-${config.label.toLowerCase()}`;
        return (
          <span className={className}>{config.label}</span>
        );
      },
      sorter: (a: Article, b: Article) => {
        const levelA = a.difficultyLevel || 0;
        const levelB = b.difficultyLevel || 0;
        return levelA - levelB;
      }
    },
    {
      title: '关联',
      dataIndex: 'relations',
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
      dataIndex: 'action',
      key: 'action',
      width: '15%',
      render: (_: any, record: Article) => (
        <div className="table-action-buttons">
          <Button 
            type="text"
            size="small"
            icon={<ReadOutlined />} 
            onClick={() => handleReadArticle(record.id)}
            title="阅读"
          />
          <Button 
            type="text"
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleEditArticle(record)}
            title="编辑"
          />
          <Button 
            type="text"
            size="small"
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteArticle(record.id)}
            className="ant-btn-dangerous"
            title="删除"
          />
        </div>
      )
    }
  ];

  // 筛选选项
  const filterOptions: FilterOption[] = [
    {
      key: 'difficultyLevel',
      label: '难度等级',
      type: 'select',
      options: difficultyLevelConfigs.map(config => ({
        label: config.label,
        value: config.value
      }))
    }
  ];

  // 批量操作
  const batchActions: BatchAction[] = [
    {
      key: 'delete',
      label: '批量删除',
      danger: true,
      onClick: handleBatchDelete
    }
  ];

  return (
    <UnifiedListPage
      title="文章管理"
      dataSource={articles}
      columns={columns}
      loading={loading}
      filterOptions={filterOptions}
      onSearch={handleSearch}
      batchActions={batchActions}
      rowKey="id"
      headerActions={[
        {
          key: 'add',
          label: '添加文章',
          type: 'primary',
          onClick: handleAddArticle
        }
      ]}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条记录`
      }}
    />
  );
};

export default ArticlePage;