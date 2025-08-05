import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllPartOfSpeech, createPartOfSpeech, updatePartOfSpeech, deletePartOfSpeech, batchDeletePartOfSpeech } from '../../../api/partOfSpeech';
import { PartOfSpeech } from '@/types';
import { UnifiedListPage } from '../../../components/unified/UnifiedListPage';
import { TableColumn, FilterOption, BatchAction } from '../../../components/unified/UnifiedListPage';
import PartOfSpeechFormDrawer from './PartOfSpeechFormDrawer';
import PartOfSpeechDetailDrawer from './PartOfSpeechDetailDrawer';
import './style.css';

const PartOfSpeechPage: React.FC = () => {
  // 状态定义
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingPartOfSpeech, setEditingPartOfSpeech] = useState<PartOfSpeech | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState<boolean>(false);
  const [viewingPartOfSpeech, setViewingPartOfSpeech] = useState<PartOfSpeech | null>(null);

  // 获取词性列表
  const fetchPartsOfSpeech = async () => {
    setLoading(true);
    try {
      const response = await getAllPartOfSpeech();
      // 确保每个词性的 commonPhrases 字段都是数组类型
      const processedData = response.data.map((item: PartOfSpeech) => ({
        ...item,
        commonPhrases: Array.isArray(item.commonPhrases) ? item.commonPhrases : []
      }));
      setPartsOfSpeech(processedData);
    } catch (error: any) {
      console.error('获取词性列表失败:', error);
      // 从错误对象中提取错误信息
      const errorMessage = error.response?.data?.message || '操作失败';
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
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个词性吗？`,
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await batchDeletePartOfSpeech(selectedRowKeys as string[]);
          message.success('批量删除成功');
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

  // 搜索过滤函数
  const handleSearch = (searchText: string, dataSource: PartOfSpeech[]) => {
    if (!searchText) return dataSource;
    
    return dataSource.filter(pos => 
      pos.englishName.toLowerCase().includes(searchText.toLowerCase()) ||
      pos.chineseMeaning.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // 表格列配置
  const columns: TableColumn[] = [
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
    }
  ];

  // 筛选选项配置
  const filterOptions: FilterOption[] = [
    {
      key: 'search',
      label: '搜索',
      type: 'input',
      placeholder: '搜索英文名称或中文含义'
    }
  ];

  // 批量操作配置
  const batchActions: BatchAction[] = [
    {
      key: 'delete',
      label: '批量删除',
      danger: true,
      onClick: handleBatchDelete
    }
  ];

  return (
    <div className="part-of-speech-page">
      <UnifiedListPage
        title="词性管理"
        description="管理英语词性信息"
        dataSource={partsOfSpeech}
        columns={columns}
        loading={loading}
        filterOptions={filterOptions}
        onSearch={handleSearch}
        batchActions={batchActions}
        rowKey="id"
        headerActions={[
          {
            key: 'add',
            label: '添加词性',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleAddPartOfSpeech,
          },
        ]}
        actionButtons={[
          {
            key: 'view',
            label: '查看',
            icon: <EyeOutlined />,
            onClick: (record: PartOfSpeech) => handleViewPartOfSpeech(record)
          },
          {
            key: 'edit',
            label: '编辑',
            icon: <EditOutlined />,
            onClick: (record: PartOfSpeech) => handleEditPartOfSpeech(record)
          },
          {
            key: 'delete',
            label: '删除',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: (record: PartOfSpeech) => handleDeletePartOfSpeech(record.id)
          }
        ]}
        pagination={{
          current: 1,
          pageSize: 10,
          total: partsOfSpeech.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 个词性`,
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