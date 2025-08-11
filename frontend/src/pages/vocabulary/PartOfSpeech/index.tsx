import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllPartOfSpeech, createPartOfSpeech, updatePartOfSpeech, deletePartOfSpeech, batchDeletePartOfSpeech } from '../../../api/partOfSpeech';
import { PartOfSpeech } from '@/types';
import PartOfSpeechFormDrawer from './PartOfSpeechFormDrawer';
import PartOfSpeechDetailDrawer from './PartOfSpeechDetailDrawer';
import './style.css';

const PartOfSpeechPage: React.FC = () => {
  // 状态定义
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [filteredPartsOfSpeech, setFilteredPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingPartOfSpeech, setEditingPartOfSpeech] = useState<PartOfSpeech | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState<boolean>(false);
  const [viewingPartOfSpeech, setViewingPartOfSpeech] = useState<PartOfSpeech | null>(null);

  // 获取词性列表
  const fetchPartsOfSpeech = async () => {
    setLoading(true);
    try {
      const response = await getAllPartOfSpeech();
      // 从后端响应中提取实际数据
      const responseData = response.data.data;
      if (!responseData) {
        message.error('获取词性列表失败：数据为空');
        return;
      }
      // 确保每个词性的 commonPhrases 字段都是数组类型
      const processedData = responseData.map((item: PartOfSpeech) => ({
        ...item,
        commonPhrases: Array.isArray(item.commonPhrases) ? item.commonPhrases : []
      }));
      setPartsOfSpeech(processedData);
      setFilteredPartsOfSpeech(processedData);
    } catch (error: any) {
      console.error('获取词性列表失败:', error);
      // 从错误对象中提取错误信息
      const errorMessage = error.message || error.response?.data?.message || '操作失败';
      message.error('获取词性列表失败: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchPartsOfSpeech();
  }, []);

  // 打开创建词性抽屉
  const handleAddPartOfSpeech = () => {
    setEditingPartOfSpeech(null);
    setDrawerVisible(true);
  };

  // 打开编辑词性抽屉
  const handleEditPartOfSpeech = (partOfSpeech: PartOfSpeech) => {
    // 创建一个新对象，确保所有字段的类型正确
    const editingPartOfSpeech = {
      // 确保基本字段存在
      id: partOfSpeech.id,
      englishName: partOfSpeech.englishName || '',
      chineseMeaning: partOfSpeech.chineseMeaning || '',
      // 确保 usageSummary 是字符串类型
      usageSummary: typeof partOfSpeech.usageSummary === 'string' ? partOfSpeech.usageSummary : '',
      // 确保 commonPhrases 是数组类型，并且每个元素都是字符串
      commonPhrases: Array.isArray(partOfSpeech.commonPhrases) 
        ? partOfSpeech.commonPhrases.map(phrase => typeof phrase === 'string' ? phrase : '')
        : []
    };
    setEditingPartOfSpeech(editingPartOfSpeech);
    setDrawerVisible(true);
  };
  
  // 打开查看词性详情抽屉
  const handleViewPartOfSpeech = (partOfSpeech: PartOfSpeech) => {
    setViewingPartOfSpeech(partOfSpeech);
    setDetailDrawerVisible(true);
  };

  // 删除词性
  const handleDeletePartOfSpeech = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个词性吗？',
      onOk: async () => {
        try {
          await deletePartOfSpeech(id);
          message.success('删除成功');
          fetchPartsOfSpeech();
        } catch (error: any) {
          console.error('删除失败:', error);
          // 从错误对象中提取错误信息
          const errorMessage = error.response?.data?.message || '操作失败';
          message.error('删除失败: ' + errorMessage);
        }
      }
    });
  };

  // 保存词性（创建或更新）
  const handleSavePartOfSpeech = async (values: { englishName: string; chineseMeaning: string; usageSummary?: string; commonPhrases?: string }) => {
    try {
      // 处理常用短语，将文本框中的换行符分割为数组
      const commonPhrases = values.commonPhrases
        ? values.commonPhrases.split('\n').filter((phrase: string) => phrase.trim() !== '')
        : [];
      
      // 构建词性对象
      const partOfSpeechData: Omit<PartOfSpeech, 'id'> = {
        englishName: values.englishName,
        chineseMeaning: values.chineseMeaning,
        usageSummary: values.usageSummary || undefined,
        commonPhrases: commonPhrases // 始终保持为数组，即使是空数组
      };
      
      if (editingPartOfSpeech) {
        // 更新词性
        await updatePartOfSpeech(editingPartOfSpeech.id, partOfSpeechData);
        message.success('更新成功');
      } else {
        // 创建词性
        await createPartOfSpeech(partOfSpeechData);
        message.success('创建成功');
      }
      
      setDrawerVisible(false);
      fetchPartsOfSpeech();
    } catch (error: any) {
      console.error('保存失败:', error);
      // 从错误对象中提取错误信息
      const errorMessage = error.response?.data?.message || '操作失败';
      if (errorMessage.includes('already exists')) {
        message.error('词性已存在，请使用其他名称');
      } else {
        message.error(editingPartOfSpeech ? '更新失败: ' + errorMessage : '创建失败: ' + errorMessage);
      }
    }
  };

  // 批量删除词性
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一个词性');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个词性吗？`,
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await batchDeletePartOfSpeech(selectedRowKeys as string[]);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          await fetchPartsOfSpeech();
        } catch (error: any) {
          console.error('批量删除失败:', error);
          // 从错误对象中提取错误信息
          const errorMessage = error.response?.data?.message || '操作失败';
          message.error('批量删除失败: ' + errorMessage);
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

  // 搜索词性
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value) {
      setFilteredPartsOfSpeech(partsOfSpeech);
      return;
    }
    
    const filtered = partsOfSpeech.filter(pos => 
      pos.englishName.toLowerCase().includes(value.toLowerCase()) ||
      pos.chineseMeaning.toLowerCase().includes(value.toLowerCase())
    );
    
    // 确保搜索结果中的 commonPhrases 字段也始终是数组类型
    const processedFiltered = filtered.map(item => ({
      ...item,
      commonPhrases: Array.isArray(item.commonPhrases) ? item.commonPhrases : []
    }));
    
    setFilteredPartsOfSpeech(processedFiltered);
  };

  // 表格列定义
  const columns = [
    {
      title: '英文名称',
      dataIndex: 'englishName',
      key: 'englishName',
      sorter: (a: PartOfSpeech, b: PartOfSpeech) => a.englishName.localeCompare(b.englishName),
      render: (text: string, record: PartOfSpeech) => (
        <a onClick={() => handleViewPartOfSpeech(record)}>{text}</a>
      )
    },
    {
      title: '中文含义',
      dataIndex: 'chineseMeaning',
      key: 'chineseMeaning',
      render: (text: string) => {
        // 截取前30个字符，避免内容过长
        const plainText = text.replace(/<[^>]+>/g, '');
        return plainText.length > 30 ? plainText.substring(0, 30) + '...' : plainText;
      }
    },
    {
      title: '用法概述',
      dataIndex: 'usageSummary',
      key: 'usageSummary',
      render: (text: string) => {
        if (!text) return '-';
        // 截取前30个字符，避免内容过长
        const plainText = text.replace(/<[^>]+>/g, '');
        return plainText.length > 30 ? plainText.substring(0, 30) + '...' : plainText;
      }
    },
    {
      title: '常用短语',
      dataIndex: 'commonPhrases',
      key: 'commonPhrases',
      render: (phrases: string[]) => {
        if (!phrases || phrases.length === 0) return '-';
        // 确保第一个短语是字符串
        const firstPhrase = typeof phrases[0] === 'string' ? phrases[0] : '';
        // 只显示第一个短语，并截取前30个字符
        const plainText = firstPhrase.replace(/<[^>]+>/g, '');
        return (phrases.length > 1 ? `${plainText.substring(0, 30)}... (共${phrases.length}个)` : plainText);
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PartOfSpeech) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />} 
            onClick={() => handleViewPartOfSpeech(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleEditPartOfSpeech(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeletePartOfSpeech(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="part-of-speech-page">
      <div className="part-of-speech-page-header">
        <h1>词性管理</h1>
        <div className="part-of-speech-page-actions">
          <Input
            placeholder="搜索英文名称或中文含义"
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: 200, marginRight: 16 }}
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddPartOfSpeech}
          >
            添加词性
          </Button>
        </div>
      </div>
      
      {/* 批量操作区域 */}
      {selectedRowKeys.length > 0 && (
        <div className="batch-actions-area">
          <div className="selected-count">
            已选择 <span className="count-number">{selectedRowKeys.length}</span> 项
          </div>
          <Button 
            size="small"
            onClick={handleClearSelection} 
            icon={<CloseCircleOutlined />}
            style={{ marginRight: 8 }}
          >
            清除选择
          </Button>
          <Button 
            size="small"
            type="primary" 
            danger 
            onClick={handleBatchDelete} 
            loading={deleteLoading}
            icon={<DeleteOutlined />}
          >
            批量删除
          </Button>
        </div>
      )}
      
      <Table
        columns={columns}
        dataSource={filteredPartsOfSpeech}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个词性`
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
      />
      
      <PartOfSpeechFormDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSavePartOfSpeech}
        initialValues={editingPartOfSpeech || undefined}
        title={editingPartOfSpeech ? '编辑词性' : '添加词性'}
      />
      
      <PartOfSpeechDetailDrawer
        visible={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        partOfSpeech={viewingPartOfSpeech}
      />
    </div>
  );
};

export default PartOfSpeechPage;