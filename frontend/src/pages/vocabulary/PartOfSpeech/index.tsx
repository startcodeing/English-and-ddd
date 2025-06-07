import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllPartOfSpeech, createPartOfSpeech, updatePartOfSpeech, deletePartOfSpeech } from '../../../api/partOfSpeech';
import { PartOfSpeech } from '@/types';
import './style.css';

const PartOfSpeechPage: React.FC = () => {
  // 状态定义
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [filteredPartsOfSpeech, setFilteredPartsOfSpeech] = useState<PartOfSpeech[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingPartOfSpeech, setEditingPartOfSpeech] = useState<PartOfSpeech | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [form] = Form.useForm();

  // 获取词性列表
  const fetchPartsOfSpeech = async () => {
    setLoading(true);
    try {
      const response = await getAllPartOfSpeech();
      setPartsOfSpeech(response.data);
      setFilteredPartsOfSpeech(response.data);
    } catch (error) {
      message.error('获取词性列表失败');
      console.error('获取词性列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchPartsOfSpeech();
  }, []);

  // 打开创建词性模态框
  const handleAddPartOfSpeech = () => {
    setEditingPartOfSpeech(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑词性模态框
  const handleEditPartOfSpeech = (partOfSpeech: PartOfSpeech) => {
    setEditingPartOfSpeech(partOfSpeech);
    form.setFieldsValue({
      englishName: partOfSpeech.englishName,
      chineseMeaning: partOfSpeech.chineseMeaning,
      usageSummary: partOfSpeech.usageSummary || '',
      commonPhrases: partOfSpeech.commonPhrases ? partOfSpeech.commonPhrases.join('\n') : ''
    });
    setModalVisible(true);
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
        } catch (error) {
          message.error('删除失败');
          console.error('删除失败:', error);
        }
      }
    });
  };

  // 保存词性（创建或更新）
  const handleSavePartOfSpeech = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理常用短语，将文本框中的换行符分割为数组
      const commonPhrases = values.commonPhrases
        ? values.commonPhrases.split('\n').filter((phrase: string) => phrase.trim() !== '')
        : [];
      
      // 构建词性对象
      const partOfSpeechData: Omit<PartOfSpeech, 'id'> = {
        englishName: values.englishName,
        chineseMeaning: values.chineseMeaning,
        usageSummary: values.usageSummary || undefined,
        commonPhrases: commonPhrases.length > 0 ? commonPhrases : undefined
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
      
      setModalVisible(false);
      fetchPartsOfSpeech();
    } catch (error) {
      console.error('保存失败:', error);
    }
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
    
    setFilteredPartsOfSpeech(filtered);
  };

  // 表格列定义
  const columns = [
    {
      title: '英文名称',
      dataIndex: 'englishName',
      key: 'englishName',
      sorter: (a: PartOfSpeech, b: PartOfSpeech) => a.englishName.localeCompare(b.englishName)
    },
    {
      title: '中文含义',
      dataIndex: 'chineseMeaning',
      key: 'chineseMeaning'
    },
    {
      title: '用法概述',
      dataIndex: 'usageSummary',
      key: 'usageSummary',
      render: (text: string) => text || '-'
    },
    {
      title: '常用短语',
      dataIndex: 'commonPhrases',
      key: 'commonPhrases',
      render: (phrases: string[]) => phrases && phrases.length > 0 
        ? phrases.join(', ')
        : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PartOfSpeech) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEditPartOfSpeech(record)}
          >
            编辑
          </Button>
          <Button 
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
      
      <Table
        columns={columns}
        dataSource={filteredPartsOfSpeech}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingPartOfSpeech ? '编辑词性' : '添加词性'}
        open={modalVisible}
        onOk={handleSavePartOfSpeech}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="englishName"
            label="英文名称"
            rules={[{ required: true, message: '请输入词性英文名称' }]}
          >
            <Input placeholder="请输入词性英文名称，如：noun, verb" />
          </Form.Item>
          
          <Form.Item
            name="chineseMeaning"
            label="中文含义"
            rules={[{ required: true, message: '请输入词性中文含义' }]}
          >
            <Input placeholder="请输入词性中文含义，如：名词、动词" />
          </Form.Item>
          
          <Form.Item
            name="usageSummary"
            label="用法概述"
          >
            <Input.TextArea 
              placeholder="请输入词性用法概述" 
              rows={3} 
            />
          </Form.Item>
          
          <Form.Item
            name="commonPhrases"
            label="常用短语"
            extra="每行一个短语"
          >
            <Input.TextArea 
              placeholder="请输入常用短语，每行一个" 
              rows={4} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PartOfSpeechPage;