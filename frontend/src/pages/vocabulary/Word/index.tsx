import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllWords, createWord, updateWord, deleteWord } from '../../../api';
import { getAllPartOfSpeech } from '../../../api';
import { Word, PartOfSpeech } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import {DifficultyLevel} from '../../../types';
import WordDetailDrawer from './WordDetailDrawer';
import './style.css';



// 简化的单词类型，用于表格展示和表单处理
interface SimpleWord {
  id: string;
  spelling: string;
  phonetic: string;
  partOfSpeechId: string;
  meaning: string;
  difficultyLevel: DifficultyLevel;
  example: string;
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
      example: mainMeaning?.exampleSentences && mainMeaning.exampleSentences.length > 0 
        ? mainMeaning.exampleSentences[0].englishSentence 
        : ''
    };
  };

  // 获取单词列表
  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await getAllWords();
      const simpleWords = response.data.map(convertToSimpleWord);
      setWords(simpleWords);
    } catch (error) {
      message.error('获取单词列表失败');
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
    } catch (error) {
      message.error('获取词性列表失败');
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
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      }
    });
  };



  // 搜索单词
  const handleSearch = () => {
    // 实际项目中可能需要调用API进行搜索
    // 这里简单实现为前端过滤
    if (!searchText) {
      fetchWords();
      return;
    }
    
    const filteredWords = words.filter(word => 
      word.spelling.toLowerCase().includes(searchText.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setWords(filteredWords);
  };

  // 表格列定义
  const columns = [
    {
      title: '拼写',
      dataIndex: 'spelling',
      key: 'spelling',
      sorter: (a: SimpleWord, b: SimpleWord) => a.spelling.localeCompare(b.spelling)
    },
    {
      title: '发音',
      dataIndex: 'phonetic',
      key: 'phonetic'
    },
    // {
    //   title: '词性',
    //   dataIndex: 'partOfSpeechId',
    //   key: 'partOfSpeechId',
    //   render: (partOfSpeechId: string) => {
    //     const partOfSpeech = partsOfSpeech.find(pos => pos.id === partOfSpeechId);
    //     return partOfSpeech ? partOfSpeech.englishName : '未知';
    //   }
    // },
    // {
    //   title: '含义',
    //   dataIndex: 'meaning',
    //   key: 'meaning'
    // },
    {
      title: '难度',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      render: (difficultyLevel: DifficultyLevel) => {
        const config = difficultyLevelConfigs.find(config => config.value === difficultyLevel);
        return config ? (
          <span style={{ color: config.color }}>{config.label}</span>
        ) : '未知';
      },
      sorter: (a: SimpleWord, b: SimpleWord) => a.difficultyLevel - b.difficultyLevel
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SimpleWord) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewWord(record)}
          >
            查看详情
          </Button>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditWord(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteWord(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="word-page">
      <div className="word-page-header">
        <h1>单词管理</h1>
        <div className="word-page-actions">
          <Input
            placeholder="搜索单词或含义"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 200, marginRight: 16 }}
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddWord}
          >
            添加单词
          </Button>
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={words}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
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
    </div>
  );
};

export default WordPage;