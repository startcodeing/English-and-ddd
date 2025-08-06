import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined, EyeOutlined, DeleteColumnOutlined } from '@ant-design/icons';
import { getAllWordBooks, createWordBook, updateWordBook, deleteWordBook, addWordToWordBook, removeWordFromWordBook, batchDeleteWordBooks } from '../../../api/wordBook';
import { getAllWords } from '../../../api';
import { WordBook, Word } from '../../../types';
import WordBookDetailDrawer from './WordBookDetailDrawer';
import AddWordDrawer from './AddWordDrawer';
import WordBookFormDrawer from './WordBookFormDrawer';
import './style.css';

const WordBookPage: React.FC = () => {
  // 状态定义
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formDrawerVisible, setFormDrawerVisible] = useState<boolean>(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState<boolean>(false);
  const [addWordDrawerVisible, setAddWordDrawerVisible] = useState<boolean>(false);
  const [editingWordBook, setEditingWordBook] = useState<WordBook | null>(null);
  const [selectedWordBook, setSelectedWordBook] = useState<WordBook | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  // 获取单词本列表
  const fetchWordBooks = async () => {
    setLoading(true);
    try {
      const response = await getAllWordBooks();
      setWordBooks(response.data);
    } catch (error: any) {
      // 从错误对象中提取错误信息
      const errorMessage = error.errorMessage || '获取单词本列表失败';
      message.error(`获取单词本列表失败: ${errorMessage}`);
      console.error('获取单词本列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取所有单词
  const fetchAllWords = async () => {
    try {
      const response = await getAllWords();
      setAllWords(response.data);
    } catch (error: any) {
      // 从错误对象中提取错误信息
      const errorMessage = error.errorMessage || '获取单词列表失败';
      message.error(`获取单词列表失败: ${errorMessage}`);
      console.error('获取单词列表失败:', error);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchWordBooks();
    fetchAllWords();
  }, []);

  // 打开创建单词本抽屉
  const handleAddWordBook = () => {
    setEditingWordBook(null);
    setFormDrawerVisible(true);
  };

  // 打开编辑单词本抽屉
  const handleEditWordBook = (wordBook: WordBook) => {
    setEditingWordBook(wordBook);
    setFormDrawerVisible(true);
  };

  // 删除单词本
  const handleDeleteWordBook = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个单词本吗？删除后无法恢复。',
      onOk: async () => {
        try {
          await deleteWordBook(id);
          message.success('删除成功');
          fetchWordBooks();
        } catch (error: any) {
          // 从错误对象中提取错误信息
          const errorMessage = error.errorMessage || '删除失败';
          message.error(`删除失败: ${errorMessage}`);
          console.error('删除失败:', error);
        }
      }
    });
  };
  
  // 批量删除单词本
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一个单词本');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个单词本吗？删除后无法恢复。`,
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await batchDeleteWordBooks(selectedRowKeys as string[]);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchWordBooks();
        } catch (error: any) {
          // 从错误对象中提取错误信息
          const errorMessage = error.errorMessage || '批量删除失败';
          message.error(`批量删除失败: ${errorMessage}`);
          console.error('批量删除失败:', error);
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

  // 保存单词本（创建或更新）
  const handleSaveWordBook = async (values: { name: string; description?: string }) => {
    try {
      const wordBookData = {
        name: values.name,
        description: values.description || undefined,
        words: editingWordBook ? editingWordBook.words : []
      };
      
      if (editingWordBook) {
        // 更新单词本
        await updateWordBook(editingWordBook.id, wordBookData);
        message.success('更新成功');
      } else {
        // 创建单词本
        await createWordBook(wordBookData);
        message.success('创建成功');
      }
      
      setFormDrawerVisible(false);
      fetchWordBooks();
    } catch (error: any) {
      // 从错误对象中提取错误信息
      const errorMessage = error.errorMessage || (editingWordBook ? '更新失败' : '创建失败');
      message.error(`${editingWordBook ? '更新' : '创建'}失败: ${errorMessage}`);
      console.error('保存失败:', error);
    }
  };

  // 查看单词本详情
  const handleViewWordBook = (wordBook: WordBook) => {
    setSelectedWordBook(wordBook);
    setDetailDrawerVisible(true);
  };

  // 打开添加单词抽屉
  const handleAddWordToBook = (wordBook: WordBook) => {
    setSelectedWordBook(wordBook);
    setAddWordDrawerVisible(true);
  };

  // 添加单词到单词本
  const handleAddWord = async (wordIds: string | string[]) => {
    if (!selectedWordBook) return;
    
    try {
      await addWordToWordBook(selectedWordBook.id, wordIds);
      message.success(Array.isArray(wordIds) ? '批量添加单词成功' : '添加单词成功');
      setAddWordDrawerVisible(false);
      fetchWordBooks(); // 刷新列表
    } catch (error: any) {
      // 从错误对象中提取错误信息
      const errorMessage = error.errorMessage || (Array.isArray(wordIds) ? '批量添加单词失败' : '添加单词失败');
      message.error(`${Array.isArray(wordIds) ? '批量添加单词' : '添加单词'}失败: ${errorMessage}`);
      console.error('添加单词失败:', error);
    }
  };

  // 从单词本移除单词
  const handleRemoveWord = async (wordId: string) => {
    if (!selectedWordBook) return;
    
    try {
      await removeWordFromWordBook(selectedWordBook.id, wordId);
      message.success('移除单词成功');
      fetchWordBooks(); // 刷新列表
      // 更新详情模态框中的数据
      const updatedWordBook = {
        ...selectedWordBook,
        words: selectedWordBook.words?.filter(word => word.id !== wordId) || []
      };
      setSelectedWordBook(updatedWordBook);
    } catch (error: any) {
      // 从错误对象中提取错误信息
      const errorMessage = error.errorMessage || '移除单词失败';
      message.error(`移除单词失败: ${errorMessage}`);
      console.error('移除单词失败:', error);
    }
  };

  // 过滤单词本
  const filteredWordBooks = wordBooks.filter(wordBook =>
    wordBook?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    (wordBook?.description && wordBook.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  // 表格列定义
  const columns = [
    {
      title: '单词本名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: WordBook) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          <a style={{ fontWeight: 'bold' }} onClick={() => handleViewWordBook(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
            {text || '暂无描述'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '单词数量',
      dataIndex: 'words',
      key: 'wordCount',
      render: (words: Word[] | null) => {
        const wordCount = words?.length || 0;
        return (
          <Tag color={wordCount > 0 ? 'blue' : 'default'}>
            {wordCount} 个单词
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_: any, record: WordBook) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewWordBook(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleAddWordToBook(record)}
          >
            添加单词
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditWordBook(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteWordBook(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="wordbook-page">
      <div className="wordbook-page-header">
        <h1>单词本管理</h1>
        <div className="wordbook-page-actions">
          <Input
            placeholder="搜索单词本名称或描述"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddWordBook}
          >
            创建单词本
          </Button>
        </div>
      </div>

      <div className="page-content">

        {/* 批量操作区域 */}
        {selectedRowKeys.length > 0 && (
          <div className="batch-actions-area">
            <span className="selected-count">
              已选择 <span className="count-number">{selectedRowKeys.length}</span> 项
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
        
        {/* 单词本表格 */}
        <Table
          size="small"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredWordBooks}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个单词本`,
          }}
        />
      </div>

      {/* 创建/编辑单词本模态框 */}
      {/* 单词本表单抽屉 */}
      <WordBookFormDrawer
        visible={formDrawerVisible}
        onClose={() => setFormDrawerVisible(false)}
        onSubmit={handleSaveWordBook}
        initialValues={editingWordBook || undefined}
        title={editingWordBook ? '编辑单词本' : '创建单词本'}
      />

      {/* 单词本详情抽屉 */}
      {selectedWordBook && (
        <WordBookDetailDrawer
          visible={detailDrawerVisible}
          wordBook={selectedWordBook}
          onClose={() => setDetailDrawerVisible(false)}
          onRemoveWord={handleRemoveWord}
        />
      )}

      {/* 添加单词抽屉 */}
      {selectedWordBook && (
        <AddWordDrawer
          visible={addWordDrawerVisible}
          onClose={() => setAddWordDrawerVisible(false)}
          onAddWord={handleAddWord}
          allWords={allWords}
          wordBookWords={selectedWordBook.words || []}
        />
      )}
    </div>
  );
};

export default WordBookPage;