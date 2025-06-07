import React, { useState, useMemo } from 'react';
import { Modal, Table, Button, Input, Space, Tag, Tooltip, message } from 'antd';
import { SearchOutlined, PlusOutlined, SoundOutlined } from '@ant-design/icons';
import { WordBook, Word } from '../../../types';

interface AddWordModalProps {
  visible: boolean;
  wordBook: WordBook;
  allWords: Word[];
  onClose: () => void;
  onAddWord: (wordId: string) => void;
}

const AddWordModal: React.FC<AddWordModalProps> = ({
  visible,
  wordBook,
  allWords,
  onClose,
  onAddWord
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 获取可添加的单词（排除已在单词本中的单词）
  const availableWords = useMemo(() => {
    const wordBookWordIds = new Set(wordBook.words.map(word => word.id));
    return allWords.filter(word => !wordBookWordIds.has(word.id));
  }, [allWords, wordBook.words]);

  // 过滤单词
  const filteredWords = useMemo(() => {
    if (!searchText) return availableWords;
    
    return availableWords.filter(word => {
      const spelling = word.spelling.toLowerCase();
      const search = searchText.toLowerCase();
      
      // 搜索单词拼写
      if (spelling.includes(search)) return true;
      
      // 搜索中文释义
      if (word.meanings && word.meanings.length > 0) {
        return word.meanings.some(meaning => 
          meaning.chineseMeaning.toLowerCase().includes(search)
        );
      }
      
      return false;
    });
  }, [availableWords, searchText]);

  // 获取单词的主要词义
  const getMainMeaning = (word: Word) => {
    if (word.meanings && word.meanings.length > 0) {
      return word.meanings[0].chineseMeaning;
    }
    return '暂无释义';
  };

  // 获取单词的词性
  const getPartOfSpeech = (word: Word) => {
    if (word.meanings && word.meanings.length > 0 && word.meanings[0].partOfSpeech) {
      return word.meanings[0].partOfSpeech.chineseMeaning;
    }
    return '未知';
  };

  // 获取难度等级显示
  const getDifficultyDisplay = (level?: number) => {
    const difficultyMap: { [key: number]: { text: string; color: string } } = {
      1: { text: '简单', color: 'green' },
      2: { text: '中等', color: 'orange' },
      3: { text: '困难', color: 'red' }
    };
    
    const difficulty = difficultyMap[level || 2];
    return <Tag color={difficulty.color}>{difficulty.text}</Tag>;
  };

  // 添加单个单词
  const handleAddSingleWord = (wordId: string) => {
    onAddWord(wordId);
  };

  // 批量添加单词
  const handleBatchAdd = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要添加的单词');
      return;
    }
    
    // 这里可以扩展为批量添加API，目前逐个添加
    selectedRowKeys.forEach(wordId => {
      onAddWord(wordId);
    });
    setSelectedRowKeys([]);
  };

  // 表格列定义
  const columns = [
    {
      title: '单词',
      dataIndex: 'spelling',
      key: 'spelling',
      render: (text: string, record: Word) => (
        <Space>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{text}</span>
          {record.phonetic && (
            <Tooltip title={`音标: ${record.phonetic}`}>
              <SoundOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '音标',
      dataIndex: 'phonetic',
      key: 'phonetic',
      render: (text: string) => (
        <span style={{ fontStyle: 'italic', color: '#666' }}>
          {text || '暂无音标'}
        </span>
      ),
    },
    {
      title: '词性',
      key: 'partOfSpeech',
      render: (_: any, record: Word) => (
        <Tag color="blue">{getPartOfSpeech(record)}</Tag>
      ),
    },
    {
      title: '释义',
      key: 'meaning',
      render: (_: any, record: Word) => (
        <Tooltip title={getMainMeaning(record)}>
          <span style={{ 
            maxWidth: 200, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap', 
            display: 'inline-block' 
          }}>
            {getMainMeaning(record)}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '难度',
      key: 'difficulty',
      render: (_: any, record: Word) => getDifficultyDisplay(record.difficultyLevel),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Word) => (
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => handleAddSingleWord(record.id)}
          size="small"
        >
          添加
        </Button>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    },
  };

  return (
    <Modal
      title={
        <Space>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>添加单词到</span>
          <Tag color="blue">{wordBook.name}</Tag>
        </Space>
      }
      open={visible}
      onCancel={() => {
        onClose();
        setSearchText('');
        setSelectedRowKeys([]);
      }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button 
          key="batch-add" 
          type="primary" 
          onClick={handleBatchAdd}
          disabled={selectedRowKeys.length === 0}
        >
          批量添加 ({selectedRowKeys.length})
        </Button>
      ]}
      width={900}
      style={{ top: 20 }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input
            placeholder="搜索单词拼写或中文释义"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <div>
            <span style={{ color: '#666' }}>
              可添加 {filteredWords.length} 个单词
            </span>
          </div>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredWords}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条，共 ${total} 个单词`,
        }}
        scroll={{ y: 400 }}
        locale={{
          emptyText: searchText ? '没有找到匹配的单词' : '暂无可添加的单词'
        }}
      />
    </Modal>
  );
};

export default AddWordModal;