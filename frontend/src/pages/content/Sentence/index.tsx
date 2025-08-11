import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, DeleteColumnOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllSentences, createSentence, updateSentence, deleteSentence, batchDeleteSentences } from '../../../api/sentence';
import { Sentence } from '../../../types';
import SentenceFormDrawer from './SentenceFormDrawer';
import SentenceViewDrawer from './SentenceViewDrawer';
import './style.css';

const { TextArea } = Input;

const SentencePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态定义
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [originalSentences, setOriginalSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
  const [viewingSentence, setViewingSentence] = useState<Sentence | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // 获取句子列表
  const fetchSentences = async () => {
    setLoading(true);
    try {
      const response = await getAllSentences();
      const sentenceData = response.data.data || response.data || [];
      const validSentenceData = Array.isArray(sentenceData) ? sentenceData : [];
      setOriginalSentences(validSentenceData);
      
      // 如果有搜索文本，应用过滤
      if (searchText.trim()) {
        const filteredSentences = validSentenceData.filter(sentence => 
          sentence.englishContent.toLowerCase().includes(searchText.toLowerCase()) ||
          sentence.chineseMeaning.toLowerCase().includes(searchText.toLowerCase())
        );
        setSentences(filteredSentences);
      } else {
        setSentences(validSentenceData);
      }
    } catch (error) {
      message.error('获取句子列表失败');
      console.error('获取句子列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchSentences();
  }, []);

  // 打开创建句子抽屉
  const handleAddSentence = () => {
    setEditingSentence(null);
    setViewingSentence(null);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  // 打开编辑句子抽屉
  const handleEditSentence = (sentence: Sentence) => {
    setEditingSentence(sentence);
    setViewingSentence(null);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };
  
  // 查看句子详情 - 导航到句子阅读页面
  const handleViewSentence = (sentence: Sentence) => {
    // 使用导航功能跳转到句子阅读页面，而不是打开抽屉
    navigate(`/content/sentence/read/${sentence.id}`);
  };

  // 删除句子
  const handleDeleteSentence = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个句子吗？',
      onOk: async () => {
        try {
          await deleteSentence(id);
          message.success('删除成功');
          fetchSentences();
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      }
    });
  };

  // 批量删除句子
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一个句子');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个句子吗？`,
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await batchDeleteSentences(selectedRowKeys as string[]);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchSentences();
        } catch (error) {
          message.error('批量删除失败');
          console.error('批量删除失败:', error);
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  // 清除选择
  const handleClearSelection = () => {
    setSelectedRowKeys([]);
  };

  // 保存句子（创建或更新）
  const handleSaveSentence = async (values: { englishContent: string; chineseMeaning: string; grammarAnalysis?: string }) => {
    try {
      // 构建句子对象
      const sentenceData: Omit<Sentence, 'id'> = {
        englishContent: values.englishContent,
        chineseMeaning: values.chineseMeaning,
        grammarAnalysis: values.grammarAnalysis || undefined,
        variants: [],
        unfamiliarWords: []
      };
      
      if (editingSentence) {
        // 更新句子
        await updateSentence(editingSentence.id, sentenceData);
        message.success('更新成功');
      } else {
        // 创建句子
        await createSentence(sentenceData);
        message.success('创建成功');
      }
      
      setDrawerVisible(false);
      fetchSentences();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 搜索句子
  const handleSearch = async () => {
    if (!searchText.trim()) {
      setSentences(originalSentences);
      return;
    }
    
    // 基于原始数据进行过滤
    const filteredSentences = originalSentences.filter(sentence => 
      sentence.englishContent.toLowerCase().includes(searchText.toLowerCase()) ||
      sentence.chineseMeaning.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setSentences(filteredSentences);
  };

  // 重置搜索
  const handleResetSearch = () => {
    setSearchText('');
    setSentences(originalSentences);
  };

  // 表格列定义
  const columns = [
    {
      title: '英文内容',
      dataIndex: 'englishContent',
      key: 'englishContent',
      width: '30%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record: Sentence) => (
        <Tooltip placement="topLeft" title={text}>
          <a className="sentence-content" onClick={() => handleViewSentence(record)}>{text}</a>
        </Tooltip>
      )
    },
    {
      title: '中文含义',
      dataIndex: 'chineseMeaning',
      key: 'chineseMeaning',
      width: '30%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="sentence-meaning">{text}</div>
        </Tooltip>
      )
    },
    {
      title: '语法分析',
      dataIndex: 'grammarAnalysis',
      key: 'grammarAnalysis',
      width: '20%',
      ellipsis: true,
      render: (text: string) => text || '-'
    },
    {
      title: '变体/陌生词',
      key: 'extras',
      width: '10%',
      render: (_: any, record: Sentence) => (
        <Space>
          {record.variants && record.variants.length > 0 && (
            <Tooltip title={`${record.variants.length}个变体`}>
              <Tag color="blue">{record.variants.length} 变体</Tag>
            </Tooltip>
          )}
          {record.unfamiliarWords && record.unfamiliarWords.length > 0 && (
            <Tooltip title={`${record.unfamiliarWords.length}个陌生词`}>
              <Tag color="orange">{record.unfamiliarWords.length} 陌生词</Tag>
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Sentence) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditSentence(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteSentence(record.id)}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="sentence-page">
      <div className="sentence-page-header">
        <h1>句子管理</h1>
        <div className="sentence-page-actions">
          <Input
            placeholder="搜索英文内容或中文含义"
            value={searchText}
            onChange={e => {
              const value = e.target.value;
              setSearchText(value);
              // 实时搜索
              if (!value.trim()) {
                setSentences(originalSentences);
              } else {
                const filteredSentences = originalSentences.filter(sentence => 
                  sentence.englishContent.toLowerCase().includes(value.toLowerCase()) ||
                  sentence.chineseMeaning.toLowerCase().includes(value.toLowerCase())
                );
                setSentences(filteredSentences);
              }
            }}
            onPressEnter={handleSearch}
            allowClear
            onClear={handleResetSearch}
            style={{ width: 200, marginRight: 8 }}
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
            onClick={handleAddSentence}
          >
            添加句子
          </Button>
        </div>
      </div>
      
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
      
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={sentences}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个句子`
        }}
      />
      
      {drawerMode === 'view' ? (
        <SentenceViewDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          sentence={viewingSentence || undefined}
          title="查看句子"
        />
      ) : (
        <SentenceFormDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          onSubmit={handleSaveSentence}
          initialValues={drawerMode === 'edit' ? (editingSentence || undefined) : undefined}
          title={drawerMode === 'edit' ? '编辑句子' : '添加句子'}
          mode={drawerMode}
        />
      )}
    </div>
  );
};

export default SentencePage;