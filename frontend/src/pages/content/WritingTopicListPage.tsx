import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Form, Input, InputNumber, Modal, Pagination, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getWritingTopics, countWritingTopics, deleteWritingTopic, batchDeleteWritingTopics, getWritingTopicById, WritingTopic, WritingTopicQuery } from '../../api/writingTopic';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const { confirm } = Modal;

const { Text } = Typography;

// 初始化Markdown解析器
const mdParser = new MarkdownIt();

const WritingTopicListPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  
  // 状态管理
  const [topics, setTopics] = useState<WritingTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchParams, setSearchParams] = useState<WritingTopicQuery>({});
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentTopic, setCurrentTopic] = useState<WritingTopic | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // 获取写作主题列表
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const params = {
        ...searchParams,
        pageNum: current,
        pageSize,
      };
      
      const [topicsRes, countRes] = await Promise.all([
        getWritingTopics(params),
        countWritingTopics(params),
      ]);
      
      if (topicsRes.success && countRes.success) {
        setTopics(topicsRes.data || []);
        setTotal(countRes.data || 0);
      } else {
        message.error(topicsRes.message || countRes.message || '获取写作主题列表失败');
      }
    } catch (error) {
      console.error('获取写作主题列表出错:', error);
      message.error('获取写作主题列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取写作主题详情
  const fetchTopicDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const response = await getWritingTopicById(id);
      if (response.success) {
        setCurrentTopic(response.data);
        setDetailVisible(true);
      } else {
        message.error(response.message || '获取写作主题详情失败');
      }
    } catch (error) {
      console.error('获取写作主题详情出错:', error);
      message.error('获取写作主题详情失败');
    } finally {
      setDetailLoading(false);
    }
  };
  
  // 关闭详情弹窗
  const handleDetailClose = () => {
    setDetailVisible(false);
    setCurrentTopic(null);
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
    setSearchParams({});
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
          const response = await deleteWritingTopic(id);
          if (response.success) {
            message.success('删除成功');
            fetchTopics();
          } else {
            message.error(response.message || '删除失败');
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
          const response = await batchDeleteWritingTopics(ids);
          if (response.success) {
            message.success('批量删除成功');
            fetchTopics();
            setSelectedRowKeys([]);
          } else {
            message.error(response.message || '批量删除失败');
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
      render: (text: string, record: WritingTopic) => (
        <Typography.Link onClick={() => navigate(`/content/writing-topics/detail/${record.id}`)}>
          {text}
        </Typography.Link>
      ),
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
        // 直接显示后端返回的难度级别
        return <span>{difficulty}</span>;
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
      {/* 搜索表单和操作按钮 */}
      <Row style={{ marginBottom: 16 }} justify="space-between" align="middle">
        <Col>
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
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
                  { value: 'easy', label: '简单' },
                  { value: 'medium', label: '中等' },
                  { value: 'hard', label: '困难' },
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
        </Col>
        <Col>
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

      {/* 详情弹窗 */}
      <Modal
        title="写作主题详情"
        open={detailVisible}
        onCancel={handleDetailClose}
        footer={[
          <Button key="close" onClick={handleDetailClose}>
            关闭
          </Button>
        ]}
        width={800}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>加载中...</div>
        ) : currentTopic ? (
          <div style={{ padding: '0 8px' }}>
            <Form layout="vertical" form={detailForm}>
              <Form.Item label="主题描述">
                <MdEditor
                  style={{ 
                    height: '300px', 
                    border: '1px solid #d9d9d9', 
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}
                  value={currentTopic.description}
                  renderHTML={text => mdParser.render(text)}
                  readOnly={true}
                  config={{
                    view: { menu: false, md: false, html: true },
                    canView: { menu: false, md: false, html: true, fullScreen: false, hideMenu: false }
                  }}
                />
              </Form.Item>
              
              <Form.Item label="ID">
                <Input value={currentTopic.id.toString()} readOnly />
              </Form.Item>
              
              <Form.Item label="来源">
                <Input value={currentTopic.source || ''} readOnly />
              </Form.Item>
              
              <Form.Item label="难度级别">
                <Select
                  value={currentTopic.difficulty}
                  disabled
                  options={[
                    { value: 'easy', label: '简单' },
                    { value: 'medium', label: '中等' },
                    { value: 'hard', label: '困难' },
                  ]}
                />
              </Form.Item>
              
              <Form.Item label="字数限制">
                <InputNumber
                  value={currentTopic.wordLimit}
                  disabled
                  addonAfter="字"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item label="时间限制">
                <InputNumber
                  value={currentTopic.timeLimit}
                  disabled
                  addonAfter="分钟"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item label="创建时间">
                <Input value={dayjs(currentTopic.createTime).format('YYYY-MM-DD HH:mm:ss')} readOnly />
              </Form.Item>
              
              <Form.Item label="更新时间">
                <Input value={dayjs(currentTopic.updateTime).format('YYYY-MM-DD HH:mm:ss')} readOnly />
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>暂无数据</div>
        )}
      </Modal>
    </Card>
  );
};

export default WritingTopicListPage;