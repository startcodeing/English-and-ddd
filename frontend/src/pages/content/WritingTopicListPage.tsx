import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Modal, Pagination, Row, Select, Space, Table, Tag, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

interface WritingTopic {
  id: number;
  description: string;
  source: string;
  difficulty: string;
  wordLimit: number;
  timeLimit: number;
  createTime: string;
  updateTime: string;
}

const { confirm } = Modal;

const WritingTopicListPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [topics, setTopics] = useState<WritingTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 搜索条件
  const [searchParams, setSearchParams] = useState({
    description: '',
    source: '',
    difficulty: '',
  });

  // 获取写作主题列表
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/writing-topics/search', {
        params: {
          ...searchParams,
          pageNum: current,
          pageSize,
        },
      });
      if (response.data.success) {
        setTopics(response.data.data);
        // 获取总数
        const countResponse = await axios.get('/api/v1/writing-topics/count/search', {
          params: searchParams,
        });
        if (countResponse.data.success) {
          setTotal(countResponse.data.data);
        }
      } else {
        message.error(response.data.message || '获取写作主题列表失败');
      }
    } catch (error) {
      console.error('获取写作主题列表出错:', error);
      message.error('获取写作主题列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和条件变化时获取数据
  useEffect(() => {
    fetchTopics();
  }, [current, pageSize, searchParams]);

  // 处理搜索
  const handleSearch = (values: any) => {
    setCurrent(1); // 重置到第一页
    setSearchParams(values);
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    setSearchParams({
      description: '',
      source: '',
      difficulty: '',
    });
  };

  // 处理分页变化
  const handlePageChange = (page: number, size?: number) => {
    setCurrent(page);
    if (size) {
      setPageSize(size);
    }
  };

  // 处理删除
  const handleDelete = (id: number) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个写作主题吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/v1/writing-topics/${id}`);
          if (response.data.success) {
            message.success('删除成功');
            fetchTopics();
          } else {
            message.error(response.data.message || '删除失败');
          }
        } catch (error) {
          console.error('删除写作主题出错:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 处理批量删除
  const handleBatchDelete = (ids: number[]) => {
    if (ids.length === 0) {
      message.warning('请选择要删除的项目');
      return;
    }

    confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${ids.length} 个写作主题吗？此操作不可恢复。`,
      onOk: async () => {
        try {
          const response = await axios.delete('/api/v1/writing-topics/batch', {
            data: ids,
          });
          if (response.data.success) {
            message.success('批量删除成功');
            fetchTopics();
            setSelectedRowKeys([]);
          } else {
            message.error(response.data.message || '批量删除失败');
          }
        } catch (error) {
          console.error('批量删除写作主题出错:', error);
          message.error('批量删除失败');
        }
      },
    });
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '主题描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
    },
    {
      title: '难度级别',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty: string) => {
        let color = 'green';
        let text = '简单';
        
        if (difficulty === 'MEDIUM') {
          color = 'orange';
          text = '中等';
        } else if (difficulty === 'HARD') {
          color = 'red';
          text = '困难';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '字数限制',
      dataIndex: 'wordLimit',
      key: 'wordLimit',
      width: 100,
      render: (wordLimit: number) => wordLimit ? `${wordLimit}字` : '-',
    },
    {
      title: '时间限制',
      dataIndex: 'timeLimit',
      key: 'timeLimit',
      width: 100,
      render: (timeLimit: number) => timeLimit ? `${timeLimit}分钟` : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: WritingTopic) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/content/writing-topics/edit/${record.id}`)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  // 表格选择配置
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return (
    <Card title="写作主题管理">
      {/* 搜索表单 */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="description" label="主题描述">
          <Input placeholder="请输入主题描述" allowClear />
        </Form.Item>
        <Form.Item name="source" label="来源">
          <Input placeholder="请输入来源" allowClear />
        </Form.Item>
        <Form.Item name="difficulty" label="难度级别">
          <Select
            placeholder="请选择难度级别"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'EASY', label: '简单' },
              { value: 'MEDIUM', label: '中等' },
              { value: 'HARD', label: '困难' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 操作按钮 */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/content/writing-topics/create')}
            >
              新增主题
            </Button>
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
              onClick={() => handleBatchDelete(selectedRowKeys as number[])}
            >
              批量删除
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 数据表格 */}
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={topics}
        loading={loading}
        pagination={false}
      />

      {/* 分页 */}
      <Row justify="end" style={{ marginTop: 16 }}>
        <Col>
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条记录`}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default WritingTopicListPage;