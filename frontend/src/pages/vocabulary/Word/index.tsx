import React, { useState, useEffect } from 'react';
import { Space, Button, message, Modal, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllWords, createWord, updateWord, deleteWord, batchDeleteWords } from '../../../api';
import { getAllPartOfSpeech } from '../../../api';
import { Word, PartOfSpeech, WordMeaning } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import { DifficultyLevel } from '../../../types';
import WordDetailDrawer from './WordDetailDrawer';
import { UnifiedListPage } from '../../../components/unified/UnifiedListPage';
import type { TableColumn, FilterOption, BatchAction } from '../../../components/unified/UnifiedListPage';

// 简化的单词类型，用于表格展示和表单处理
interface SimpleWord {
  id: string;
  spelling: string;
  phonetic: string;
  partOfSpeechId: string;
  meaning: string;
  difficultyLevel: DifficultyLevel;
  example: string;
  meanings: WordMeaning[];
}

const WordPage: React.FC = () => {
  // 状态定义
  const [words, setWords] = useState<SimpleWord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingWord, setEditingWord] = useState<SimpleWord | null>(null);
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // 将API返回的Word转换为SimpleWord
  const convertToSimpleWord = (word: Word): SimpleWord => {
    const mainMeaning = word.meanings && word.meanings.length > 0 ? word.meanings[0] : null;
    return {
      id: word.id,
      spelling: word.spelling,
      phonetic: word.phonetic || '',
      partOfSpeechId: mainMeaning?.partOfSpeechId || '',
      meaning: mainMeaning?.chineseMeaning || '',
      difficultyLevel: word.difficultyLevel || DifficultyLevel.MEDIUM,
      example: mainMeaning?.sentences && mainMeaning.sentences.length > 0 
        ? mainMeaning.sentences[0].englishContent 
        : '',
      meanings: word.meanings || []
    };
  };

  // 获取单词列表
  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await getAllWords();
      const simpleWords = response.data.map(convertToSimpleWord);
      setWords(simpleWords);
    } catch (error: any) {
      const errorMessage = error.errorMessage || '获取单词列表失败';
      message.error(`获取单词列表失败: ${errorMessage}`);
      console.error('获取单词列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取词性列表
  const fetchPartsOfSpeech = async () => {
    try {
      const response = await getAllPartOfSpeech();
      setPartsOfSpeech(response.data);
    } catch (error: any) {
      const errorMessage = error.errorMessage || '获取词性列表失败';
      message.error(`获取词性列表失败: ${errorMessage}`);
      console.error('获取词性列表失败:', error);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchWords();
    fetchPartsOfSpeech();
    
    // 添加自定义事件监听器，用于刷新单词列表但不关闭抽屉
    const handleRefreshWordList = (event: CustomEvent) => {
      fetchWords();
      // 如果需要关闭抽屉，则调用handleCloseDrawer
      if (event.detail?.closeDrawer !== false) {
        handleCloseDrawer();
      }
    };
    
    // 添加事件监听器
    window.addEventListener('refreshWordList', handleRefreshWordList as EventListener);
    
    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('refreshWordList', handleRefreshWordList as EventListener);
    };
  }, []);

  // 打开创建单词抽屉
  const handleAddWord = () => {
    setEditingWord(null);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  // 打开编辑单词抽屉
  const handleEditWord = (word: SimpleWord) => {
    setEditingWord(word);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  // 查看单词详情
  const handleViewWord = (word: SimpleWord) => {
    setEditingWord(word);
    setDrawerMode('view');
    setDrawerVisible(true);
  };

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setEditingWord(null);
  };

  // 删除单词
  const handleDeleteWord = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个单词吗？',
      onOk: async () => {
        try {
          await deleteWord(id);
          message.success('删除成功');
          fetchWords();
        } catch (error: any) {
          const errorMessage = error.errorMessage || '删除失败';
          message.error(`删除失败: ${errorMessage}`);
          console.error('删除失败:', error);
        }
      }
    });
  };
  
  // 批量删除单词
  const handleBatchDelete = async () => {
    if (!selectedRowKeys.length) return;
    
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个单词吗？`,
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await batchDeleteWords(selectedRowKeys as string[]);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          fetchWords();
        } catch (error: any) {
          const errorMessage = error.errorMessage || '批量删除失败';
          message.error(`批量删除失败: ${errorMessage}`);
          console.error('批量删除失败:', error);
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };

  // 搜索单词
  const handleSearch = (searchText: string, dataSource: SimpleWord[]): SimpleWord[] => {
    if (!searchText) {
      return dataSource;
    }
    
    return dataSource.filter(word => 
      word.spelling.toLowerCase().includes(searchText.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // 重置搜索
  const handleReset = () => {
    setSearchText('');
    fetchWords();
  };

  // 表格列定义
  const columns: TableColumn[] = [
    {
      title: '拼写',
      dataIndex: 'spelling',
      key: 'spelling',
      width: '20%',
      sorter: (a: SimpleWord, b: SimpleWord) => a.spelling.localeCompare(b.spelling),
      render: (text: string, record: SimpleWord) => (
        <a className="table-link" onClick={() => handleViewWord(record)}>{text}</a>
      )
    },
    {
      title: '发音',
      dataIndex: 'phonetic',
      key: 'phonetic',
      width: '15%',
      render: (text: string) => (
        <span className="phonetic-text">{text || '-'}</span>
      )
    },
    {
      title: '词性',
      dataIndex: 'meanings',
      key: 'partsOfSpeech',
      width: '15%',
      render: (record: SimpleWord) => {
        if (!record.meanings || record.meanings.length === 0) {
          return <span className="text-muted">无</span>;
        }
        
        // 获取所有词性名称
        const posNames = record.meanings.map(meaning => {
          const partOfSpeech = partsOfSpeech.find(pos => pos.id === meaning.partOfSpeechId);
          return partOfSpeech ? partOfSpeech.englishName : '未知';
        });
        
        // 使用 / 分隔词性名称
        const posText = posNames.join('/');
        
        // 准备悬停提示的详细内容
        const tooltipContent = (
          <div>
            {record.meanings.map((meaning, index) => {
              const partOfSpeech = partsOfSpeech.find(pos => pos.id === meaning.partOfSpeechId);
              return (
                <div key={meaning.id || index} style={{ marginBottom: '8px' }}>
                  <div><strong>词性：</strong>{partOfSpeech ? `${partOfSpeech.englishName} (${partOfSpeech.chineseMeaning})` : '未知'}</div>
                  <div><strong>释义：</strong>{meaning.chineseMeaning}</div>
                </div>
              );
            })}
          </div>
        );
        
        return (
          <Tooltip title={tooltipContent} placement="right">
            <span className="pos-text">{posText}</span>
          </Tooltip>
        );
      }
    },
    {
      title: '难度',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: '10%',
      render: (difficultyLevel: DifficultyLevel) => {
        const config = difficultyLevelConfigs.find(config => config.value === difficultyLevel);
        if (!config) return <span className="text-muted">未知</span>;
        
        const className = `status-tag difficulty-${config.label.toLowerCase()}`;
        return (
          <span className={className}>{config.label}</span>
        );
      },
      sorter: (a: SimpleWord, b: SimpleWord) => a.difficultyLevel - b.difficultyLevel
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '20%',
      render: (_: any, record: SimpleWord) => (
        <div className="table-action-buttons">
          <Button 
            type="text"
            size="small"
            icon={<EyeOutlined />} 
            onClick={() => handleViewWord(record)}
            title="查看详情"
          />
          <Button 
            type="text"
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleEditWord(record)}
            title="编辑"
          />
          <Button 
            type="text"
            size="small"
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteWord(record.id)}
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
    },
    {
      key: 'partOfSpeech',
      label: '词性',
      type: 'select',
      options: partsOfSpeech.map(pos => ({
        label: `${pos.englishName} (${pos.chineseMeaning})`,
        value: pos.id
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
    <>
      <UnifiedListPage
        title="单词管理"
        dataSource={words}
        columns={columns}
        loading={loading}
        filterOptions={filterOptions}
        onSearch={handleSearch}
        batchActions={batchActions}
        rowKey="id"
        headerActions={[
          {
            key: 'add',
            label: '添加单词',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleAddWord,
          },
        ]}
        pagination={{
          current: 1,
          pageSize: 10,
          total: words.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 个单词`,
        }}
      />
      
      <WordDetailDrawer
        visible={drawerVisible}
        mode={drawerMode}
        wordId={editingWord?.id}
        onClose={handleCloseDrawer}
        onSuccess={() => {
          // 这里保留原有的行为，用于其他操作（如添加词义、删除词义等）完成后的处理
          // 基本信息保存会通过自定义事件处理
          fetchWords();
          handleCloseDrawer();
        }}
      />
    </>
  );
};

export default WordPage;