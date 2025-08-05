import React, { useState, useMemo } from 'react';
import { Drawer, Input, Table, Button, Space, Tag, Tooltip, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, SoundOutlined } from '@ant-design/icons';
import { Word } from '../../../types';

interface AddWordDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAddWord: (wordId: string | string[]) => void;
  allWords: Word[];
  wordBookWords: Word[];
}

const AddWordDrawer: React.FC<AddWordDrawerProps> = ({
  visible,
  onClose,
  onAddWord,
  allWords,
  wordBookWords
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 获取可添加的单词（不在当前单词本中的单词）
  const availableWords = useMemo(() => {
    const wordBookWordIds = wordBookWords.map(word => word.id);
    return allWords.filter(word => !wordBookWordIds.includes(word.id));
  }, [allWords, wordBookWords]);

  // 根据搜索文本过滤单词
  const filteredWords = useMemo(() => {
    if (!searchText) return availableWords;
    return availableWords.filter(word => 
      word.spelling.toLowerCase().includes(searchText.toLowerCase()) ||
      (word.meanings && word.meanings.some(meaning => 
        meaning.chineseMeaning.includes(searchText)
      ))
    );
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
    
    const difficulty = difficultyMap[level || 2] || difficultyMap[2];
    return <Tag color={difficulty.color}>{difficulty.text}</Tag>;
  };

  // 处理单个添加
  const handleAdd = (wordId: string) => {
    onAddWord(wordId);
  };

  // 处理批量添加
  const handleBatchAdd = () => {
    if (selectedRowKeys.length > 0) {
      onAddWord(selectedRowKeys);
      setSelectedRowKeys([]);
    }
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
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAdd(record.id)}
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
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[]);
    },
  };

  return (
    <Drawer
      title="添加单词"
      open={visible}
      onClose={onClose}
      width={900}
      placement="right"
      extra={
        <Space>
          <Button 
            type="primary" 
            onClick={handleBatchAdd} 
            disabled={selectedRowKeys.length === 0}
          >
            批量添加 ({selectedRowKeys.length})
          </Button>
          <Button onClick={onClose}>关闭</Button>
        </Space>
      }
    >
      <Row style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="搜索单词或释义"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
      </Row>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredWords}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个单词`,
        }}
        scroll={{ y: 500 }}
        locale={{
          emptyText: '没有可添加的单词'
        }}
      />
    </Drawer>
  );
};

export default AddWordDrawer;