import React, { useState, useEffect } from 'react';
import { Modal, message, Tag, Tooltip, Space } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined, EyeOutlined, DeleteColumnOutlined } from '@ant-design/icons';
import { UnifiedListPage, TableColumn, FilterOption, BatchAction } from '../../../components/unified/UnifiedListPage';
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
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

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
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个单词本吗？删除后无法恢复。`,
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await batchDeleteWordBooks(selectedRowKeys as string[]);
          message.success('批量删除成功');
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

  // 搜索过滤函数
  const handleSearch = (searchText: string, dataSource: WordBook[]) => {
    return dataSource.filter(wordBook =>
      wordBook?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      (wordBook?.description && wordBook.description.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  // 表格列定义
  const columns: TableColumn[] = [
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
  ];

  // 搜索过滤选项
  const filterOptions: FilterOption[] = [
    {
      key: 'search',
      label: '搜索单词本',
      type: 'input',
      placeholder: '搜索单词本名称或描述',
    },
  ];

  // 批量操作配置
  const batchActions: BatchAction[] = [
    {
      key: 'delete',
      label: '批量删除',
      danger: true,
      onClick: handleBatchDelete,
    },
  ];

  return (
    <div className="wordbook-page">
      <UnifiedListPage<WordBook>
        title="单词本管理"
        description="管理您的单词本，创建、编辑和组织单词集合"
        dataSource={wordBooks}
        columns={columns}
        loading={loading}
        filterOptions={filterOptions}
        onSearch={handleSearch}
        batchActions={batchActions}
        rowKey="id"
        headerActions={[
          {
            key: 'add',
            label: '创建单词本',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleAddWordBook,
          },
        ]}
        actionButtons={[
          {
            key: 'view',
            label: '查看',
            icon: <EyeOutlined />,
            onClick: (record: WordBook) => handleViewWordBook(record),
          },
          {
            key: 'addWord',
            label: '添加单词',
            icon: <PlusOutlined />,
            onClick: (record: WordBook) => handleAddWordToBook(record),
          },
          {
            key: 'edit',
            label: '编辑',
            icon: <EditOutlined />,
            onClick: (record: WordBook) => handleEditWordBook(record),
          },
          {
            key: 'delete',
            label: '删除',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: (record: WordBook) => handleDeleteWordBook(record.id),
          },
        ]}
        pagination={{
          current: 1,
          pageSize: 10,
          total: wordBooks.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 个单词本`,
        }}
      />

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