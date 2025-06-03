import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, Select, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllWords, createWord, updateWord, deleteWord } from '../../../api';
import { getAllPartOfSpeech } from '../../../api';
import { Word, PartOfSpeech } from '../../../types';
import { difficultyLevelConfigs } from '../../../config';
import {DifficultyLevel} from '../../../types';
import './style.css';

const { Option } = Select;

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingWord, setEditingWord] = useState<SimpleWord | null>(null);
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [form] = Form.useForm();

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
  }, []);

  // 打开创建单词模态框
  const handleAddWord = () => {
    setEditingWord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑单词模态框
  const handleEditWord = (word: SimpleWord) => {
    setEditingWord(word);
    form.setFieldsValue({
      spelling: word.spelling,
      phonetic: word.phonetic,
      partOfSpeechId: word.partOfSpeechId,
      meaning: word.meaning,
      difficultyLevel: word.difficultyLevel,
      example: word.example
    });
    setModalVisible(true);
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

  // 保存单词（创建或更新）
  const handleSaveWord = async () => {
    try {
      const values = await form.validateFields();
      
      // 构建Word对象
      const wordData: any = {
        spelling: values.spelling,
        phonetic: values.phonetic,
        difficultyLevel: values.difficultyLevel,
        meanings: [
          {
            partOfSpeechId: values.partOfSpeechId,
            chineseMeaning: values.meaning,
            exampleSentences: values.example ? [
              {
                englishSentence: values.example,
                chineseSentence: ''
              }
            ] : []
          }
        ]
      };
      
      if (editingWord) {
        // 更新单词
        await updateWord(editingWord.id, wordData);
        message.success('更新成功');
      } else {
        // 创建单词
        await createWord(wordData);
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchWords();
    } catch (error) {
      console.error('保存失败:', error);
    }
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
    {
      title: '词性',
      dataIndex: 'partOfSpeechId',
      key: 'partOfSpeechId',
      render: (partOfSpeechId: string) => {
        const partOfSpeech = partsOfSpeech.find(pos => pos.id === partOfSpeechId);
        return partOfSpeech ? partOfSpeech.englishName : '未知';
      }
    },
    {
      title: '含义',
      dataIndex: 'meaning',
      key: 'meaning'
    },
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
      
      <Modal
        title={editingWord ? '编辑单词' : '添加单词'}
        open={modalVisible}
        onOk={handleSaveWord}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="spelling"
            label="拼写"
            rules={[{ required: true, message: '请输入单词拼写' }]}
          >
            <Input placeholder="请输入单词拼写" />
          </Form.Item>
          
          <Form.Item
            name="phonetic"
            label="发音"
            rules={[{ required: true, message: '请输入单词发音' }]}
          >
            <Input placeholder="请输入单词发音，如：/həˈləʊ/" />
          </Form.Item>
          
          <Form.Item
            name="partOfSpeechId"
            label="词性"
            rules={[{ required: true, message: '请选择词性' }]}
          >
            <Select placeholder="请选择词性">
              {partsOfSpeech.map(pos => (
                <Option key={pos.id} value={pos.id}>{pos.englishName}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="meaning"
            label="含义"
            rules={[{ required: true, message: '请输入单词含义' }]}
          >
            <Input.TextArea placeholder="请输入单词含义" rows={2} />
          </Form.Item>
          
          <Form.Item
            name="difficultyLevel"
            label="难度"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select placeholder="请选择难度">
              {difficultyLevelConfigs.map(config => (
                <Option key={config.value} value={config.value}>
                  <span style={{ color: config.color }}>{config.label}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="example"
            label="示例"
          >
            <Input.TextArea placeholder="请输入示例句子" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WordPage;