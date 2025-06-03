import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getAllSentences, createSentence, updateSentence, deleteSentence } from '../../../api/sentence';
import { Sentence } from '../../../types';
import './style.css';

const { TextArea } = Input;

const SentencePage: React.FC = () => {
  // 状态定义
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [form] = Form.useForm();

  // 获取句子列表
  const fetchSentences = async () => {
    setLoading(true);
    try {
      const response = await getAllSentences();
      setSentences(response.data);
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

  // 打开创建句子模态框
  const handleAddSentence = () => {
    setEditingSentence(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑句子模态框
  const handleEditSentence = (sentence: Sentence) => {
    setEditingSentence(sentence);
    form.setFieldsValue({
      englishContent: sentence.englishContent,
      chineseMeaning: sentence.chineseMeaning,
      grammarAnalysis: sentence.grammarAnalysis || ''
    });
    setModalVisible(true);
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

  // 保存句子（创建或更新）
  const handleSaveSentence = async () => {
    try {
      const values = await form.validateFields();
      
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
      
      setModalVisible(false);
      fetchSentences();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 搜索句子
  const handleSearch = async () => {
    if (!searchText) {
      fetchSentences();
      return;
    }
    
    // 在实际应用中，应该调用API进行搜索
    // 这里简单实现为前端过滤
    const filteredSentences = sentences.filter(sentence => 
      sentence.englishContent.toLowerCase().includes(searchText.toLowerCase()) ||
      sentence.chineseMeaning.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setSentences(filteredSentences);
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
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="sentence-content">{text}</div>
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
      width: '15%',
      render: (_: any, record: Sentence) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEditSentence(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteSentence(record.id)}
          >
            删除
          </Button>
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
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 200, marginRight: 16 }}
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSentence}
          >
            添加句子
          </Button>
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={sentences}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingSentence ? '编辑句子' : '添加句子'}
        open={modalVisible}
        onOk={handleSaveSentence}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="englishContent"
            label="英文内容"
            rules={[{ required: true, message: '请输入英文内容' }]}
          >
            <TextArea 
              placeholder="请输入英文内容" 
              rows={3} 
              showCount 
              maxLength={500}
            />
          </Form.Item>
          
          <Form.Item
            name="chineseMeaning"
            label="中文含义"
            rules={[{ required: true, message: '请输入中文含义' }]}
          >
            <TextArea 
              placeholder="请输入中文含义" 
              rows={3} 
              showCount 
              maxLength={500}
            />
          </Form.Item>
          
          <Form.Item
            name="grammarAnalysis"
            label="语法分析"
            tooltip={{ title: '分析句子的语法结构，如时态、语态、从句类型等', icon: <InfoCircleOutlined /> }}
          >
            <TextArea 
              placeholder="请输入语法分析" 
              rows={4} 
              showCount 
              maxLength={1000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SentencePage;