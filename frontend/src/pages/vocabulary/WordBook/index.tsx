import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllWordBooks, createWordBook, updateWordBook, deleteWordBook, addWordToWordBook, removeWordFromWordBook } from '../../../api/wordBook';
import { getAllWords } from '../../../api';
import { WordBook, Word } from '../../../types';
import WordBookDetailModal from './WordBookDetailModal';
import AddWordModal from './AddWordModal';
import './style.css';

const WordBookPage: React.FC = () => {
  // 状态定义
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [addWordModalVisible, setAddWordModalVisible] = useState<boolean>(false);
  const [editingWordBook, setEditingWordBook] = useState<WordBook | null>(null);
  const [selectedWordBook, setSelectedWordBook] = useState<WordBook | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [form] = Form.useForm();

  // 获取单词本列表
  const fetchWordBooks = async () => {
    setLoading(true);
    try {
      const response = await getAllWordBooks();
      setWordBooks(response.data);
    } catch (error) {
      message.error('获取单词本列表失败');
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
    } catch (error) {
      message.error('获取单词列表失败');
      console.error('获取单词列表失败:', error);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchWordBooks();
    fetchAllWords();
  }, []);

  // 打开创建单词本模态框
  const handleAddWordBook = () => {
    setEditingWordBook(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑单词本模态框
  const handleEditWordBook = (wordBook: WordBook) => {
    setEditingWordBook(wordBook);
    form.setFieldsValue({
      name: wordBook.name,
      description: wordBook.description || ''
    });
    setModalVisible(true);
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
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      }
    });
  };

  // 保存单词本（创建或更新）
  const handleSaveWordBook = async () => {
    try {
      const values = await form.validateFields();
      
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
      
      setModalVisible(false);
      form.resetFields();
      fetchWordBooks();
    } catch (error: any) {
      if (error.errorFields) {
        message.error('请检查表单输入');
      } else {
        message.error(editingWordBook ? '更新失败' : '创建失败');
        console.error('保存失败:', error);
      }
    }
  };

  // 查看单词本详情
  const handleViewWordBook = (wordBook: WordBook) => {
    setSelectedWordBook(wordBook);
    setDetailModalVisible(true);
  };

  // 打开添加单词模态框
  const handleAddWordToBook = (wordBook: WordBook) => {
    setSelectedWordBook(wordBook);
    setAddWordModalVisible(true);
  };

  // 添加单词到单词本
  const handleAddWord = async (wordId: string) => {
    if (!selectedWordBook) return;
    
    try {
      await addWordToWordBook(selectedWordBook.id, wordId);
      message.success('添加单词成功');
      setAddWordModalVisible(false);
      fetchWordBooks(); // 刷新列表
    } catch (error) {
      message.error('添加单词失败');
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
        words: selectedWordBook.words.filter(word => word.id !== wordId)
      };
      setSelectedWordBook(updatedWordBook);
    } catch (error) {
      message.error('移除单词失败');
      console.error('移除单词失败:', error);
    }
  };

  // 过滤单词本
  const filteredWordBooks = wordBooks.filter(wordBook =>
    wordBook.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (wordBook.description && wordBook.description.toLowerCase().includes(searchText.toLowerCase()))
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
          <span style={{ fontWeight: 'bold' }}>{text}</span>
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
      render: (words: Word[]) => (
        <Tag color={words.length > 0 ? 'blue' : 'default'}>
          {words.length} 个单词
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WordBook) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewWordBook(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => handleAddWordToBook(record)}
          >
            添加单词
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditWordBook(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
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
      <div className="page-header">
        <h2>单词本管理</h2>
        <p>管理您的单词本，组织和学习单词</p>
      </div>

      <div className="page-content">
        {/* 搜索和操作栏 */}
        <div className="toolbar">
          <div className="search-section">
            <Input
              placeholder="搜索单词本名称或描述"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
          <div className="action-section">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddWordBook}
            >
              创建单词本
            </Button>
          </div>
        </div>

        {/* 单词本表格 */}
        <Table
          columns={columns}
          dataSource={filteredWordBooks}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个单词本`,
          }}
        />
      </div>

      {/* 创建/编辑单词本模态框 */}
      <Modal
        title={editingWordBook ? '编辑单词本' : '创建单词本'}
        open={modalVisible}
        onOk={handleSaveWordBook}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            description: ''
          }}
        >
          <Form.Item
            label="单词本名称"
            name="name"
            rules={[
              { required: true, message: '请输入单词本名称' },
              { max: 50, message: '单词本名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入单词本名称" />
          </Form.Item>
          
          <Form.Item
            label="描述"
            name="description"
            rules={[
              { max: 200, message: '描述不能超过200个字符' }
            ]}
          >
            <Input.TextArea
              placeholder="请输入单词本描述（可选）"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 单词本详情模态框 */}
      {selectedWordBook && (
        <WordBookDetailModal
          visible={detailModalVisible}
          wordBook={selectedWordBook}
          onClose={() => setDetailModalVisible(false)}
          onRemoveWord={handleRemoveWord}
        />
      )}

      {/* 添加单词模态框 */}
      {selectedWordBook && (
        <AddWordModal
          visible={addWordModalVisible}
          wordBook={selectedWordBook}
          allWords={allWords}
          onClose={() => setAddWordModalVisible(false)}
          onAddWord={handleAddWord}
        />
      )}
    </div>
  );
};

export default WordBookPage;