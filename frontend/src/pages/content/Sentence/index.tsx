import React, { useState, useEffect } from 'react';
import { Modal, message, Tag, Tooltip, Space } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllSentences, createSentence, updateSentence, deleteSentence, batchDeleteSentences } from '../../../api/sentence';
import { Sentence } from '../../../types';
import { UnifiedListPage } from '../../../components/unified/UnifiedListPage';
import { TableColumn, FilterOption, BatchAction } from '../../../components/unified/UnifiedListPage';
import SentenceFormDrawer from './SentenceFormDrawer';
import SentenceViewDrawer from './SentenceViewDrawer';
import './style.css';

const SentencePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态定义
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
  const [viewingSentence, setViewingSentence] = useState<Sentence | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // 获取句子列表
  const fetchSentences = async () => {
    setLoading(true);
    try {
      const response = await getAllSentences();
      setSentences(response.data || []);
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
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个句子吗？`,
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await batchDeleteSentences(selectedRowKeys as string[]);
          message.success('批量删除成功');
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

  // 搜索过滤函数
  const handleSearch = (searchText: string, dataSource: Sentence[]) => {
    if (!searchText) return dataSource;
    
    return dataSource.filter(sentence => 
      sentence.englishContent.toLowerCase().includes(searchText.toLowerCase()) ||
      sentence.chineseMeaning.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // 表格列配置
  const columns: TableColumn[] = [
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
    }
  ];

  // 筛选选项配置
  const filterOptions: FilterOption[] = [
    {
      key: 'search',
      label: '搜索',
      type: 'input',
      placeholder: '搜索英文内容或中文含义'
    }
  ];

  // 批量操作配置
  const batchActions: BatchAction[] = [
    {
      key: 'delete',
      label: '批量删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleBatchDelete
    }
  ];

  return (
    <div className="sentence-page">
      <UnifiedListPage<Sentence>
        title="句子管理"
        description="管理英语句子信息"
        dataSource={sentences}
        columns={columns}
        loading={loading}
        filterOptions={filterOptions}
        onSearch={handleSearch}
        batchActions={batchActions}
        rowKey="id"
        headerActions={[
          {
            key: 'add',
            label: '添加句子',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleAddSentence
          }
        ]}
        actionButtons={[
          {
            key: 'view',
            label: '查看',
            icon: <InfoCircleOutlined />,
            onClick: (record: Sentence) => handleViewSentence(record)
          },
          {
            key: 'edit',
            label: '编辑',
            icon: <EditOutlined />,
            onClick: (record: Sentence) => handleEditSentence(record)
          },
          {
            key: 'delete',
            label: '删除',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: (record: Sentence) => handleDeleteSentence(record.id)
          }
        ]}
        pagination={{
          current: 1,
          pageSize: 10,
          total: sentences.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 个句子`
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