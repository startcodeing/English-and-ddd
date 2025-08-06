import React from 'react';
import { Drawer, Table, Button, Space, Tag, Tooltip } from 'antd';
import { DeleteOutlined, SoundOutlined } from '@ant-design/icons';
import { WordBook, Word } from '../../../types';

interface WordBookDetailDrawerProps {
  visible: boolean;
  wordBook: WordBook;
  onClose: () => void;
  onRemoveWord: (wordId: string) => void;
}

const WordBookDetailDrawer: React.FC<WordBookDetailDrawerProps> = ({
  visible,
  wordBook,
  onClose,
  onRemoveWord
}) => {
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
    
    const difficulty = difficultyMap[level || 2] || { text: '中等', color: 'orange' };
    return <Tag color={difficulty.color}>{difficulty.text}</Tag>;
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
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveWord(record.id)}
          size="small"
        >
          移除
        </Button>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <Space>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {wordBook.name}
          </span>
          <Tag color="blue">{wordBook.words?.length || 0} 个单词</Tag>
        </Space>
      }
      open={visible}
      onClose={onClose}
      width={900}
      placement="right"
      extra={
        <Button onClick={onClose}>
          关闭
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        {wordBook.description && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <strong>描述：</strong>{wordBook.description}
          </div>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={wordBook.words || []}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个单词`,
        }}
        scroll={{ y: 500 }}
        locale={{
          emptyText: '该单词本暂无单词'
        }}
      />
    </Drawer>
  );
};

export default WordBookDetailDrawer;