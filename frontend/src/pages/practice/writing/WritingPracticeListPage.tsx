import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Form, Input, Modal, Pagination, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getWritingPractices, countWritingPractices, deleteWritingPractice, batchDeleteWritingPractices, getWritingPracticeById, WritingPractice, WritingPracticeQuery } from '../../../api/writingPractice';
import { getWritingTopicById, getWritingTopics, WritingTopic } from '../../../api/writingTopic';

const { confirm } = Modal;
const { Text } = Typography;

const WritingPracticeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 状态管理
  const [practices, setPractices] = useState<WritingPractice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchParams, setSearchParams] = useState<WritingPracticeQuery>({});
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentPractice, setCurrentPractice] = useState<WritingPractice | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [topicsMap, setTopicsMap] = useState<Record<number, WritingTopic>>({});
  const [allTopics, setAllTopics] = useState<WritingTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState<boolean>(false);

  // 获取写作练习列表
  const fetchPractices = async () => {
    setLoading(true);
    try {
      const params = {
        ...searchParams,
        pageNum: current,
        pageSize,
      };
      
      const [practicesRes, countRes] = await Promise.all([
        getWritingPractices(params),
        countWritingPractices(params),
      ]);
      
      if (practicesRes.success && countRes.success) {
        const practicesList = practicesRes.data || [];
        setPractices(practicesList);
        setTotal(countRes.data || 0);
        
        // 获取所有主题信息
        fetchTopicsInfo(practicesList);
      } else {
        message.error(practicesRes.message || countRes.message || '获取写作练习列表失败');
      }
    } catch (error) {
      console.error('获取写作练习列表出错:', error);
      message.error('获取写作练习列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 获取主题信息
  const fetchTopicsInfo = async (practicesList: WritingPractice[]) => {
    try {
      // 获取不重复的主题ID列表
      const topicIds = Array.from(new Set(practicesList.map(practice => practice.topicId)));
      
      // 过滤掉已经获取过的主题
      const newTopicIds = topicIds.filter(id => !topicsMap[id]);
      
      if (newTopicIds.length === 0) return;
      
      // 并行获取所有主题信息
      const topicPromises = newTopicIds.map(id => getWritingTopicById(id));
      const topicResponses = await Promise.all(topicPromises);
      
      // 更新主题映射
      const newTopicsMap = { ...topicsMap };
      topicResponses.forEach((response, index) => {
        if (response.success && response.data) {
          newTopicsMap[newTopicIds[index]] = response.data;
        }
      });
      
      setTopicsMap(newTopicsMap);
    } catch (error) {
      console.error('获取主题信息出错:', error);
    }
  };

  // 获取写作练习详情
  const fetchPracticeDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const response = await getWritingPracticeById(id);
      if (response.success) {
        setCurrentPractice(response.data);
        setDetailVisible(true);
      } else {
        message.error(response.message || '获取写作练习详情失败');
      }
    } catch (error) {
      console.error('获取写作练习详情出错:', error);
      message.error('获取写作练习详情失败');
    } finally {
      setDetailLoading(false);
    }
  };
  
  // 关闭详情弹窗
  const handleDetailClose = () => {
    setDetailVisible(false);
    setCurrentPractice(null);
  };

  // 获取所有主题
  const fetchAllTopics = async () => {
    setTopicsLoading(true);
    try {
      const response = await getWritingTopics({ pageSize: 100 }); // 获取较多主题，实际项目中可能需要分页
      if (response.success && response.data) {
        setAllTopics(response.data);
        
        // 更新主题映射
        const newTopicsMap = { ...topicsMap };
        response.data.forEach(topic => {
          newTopicsMap[topic.id] = topic;
        });
        setTopicsMap(newTopicsMap);
      }
    } catch (error) {
      console.error('获取所有主题出错:', error);
      message.error('获取主题列表失败');
    } finally {
      setTopicsLoading(false);
    }
  };

  // 初始加载和条件变化时获取数据
  useEffect(() => {
    fetchPractices();
  }, [current, pageSize, searchParams]);
  
  // 组件加载时获取所有主题
  useEffect(() => {
    fetchAllTopics();
  }, []);

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
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  // 删除写作练习
  const handleDelete = (id: number) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个写作练习吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const response = await deleteWritingPractice(id);
          if (response.success) {
            message.success('删除成功');
            fetchPractices();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          console.error('删除写作练习出错:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 批量删除写作练习
  const handleBatchDelete = (ids: number[]) => {
    if (ids.length === 0) {
      message.warning('请选择要删除的项目');
      return;
    }

    confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${ids.length} 个写作练习吗？此操作不可恢复。`,
      onOk: async () => {
        try {
          const response = await batchDeleteWritingPractices(ids);
          if (response.success) {
            message.success('批量删除成功');
            fetchPractices();
            setSelectedRowKeys([]);
          } else {
            message.error(response.message || '批量删除失败');
          }
        } catch (error) {
          console.error('批量删除写作练习出错:', error);
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
      dataIndex: 'topicId',
      key: 'topicId',
      width: 200,
      ellipsis: true,
      render: (topicId: number) => {
        const topic = topicsMap[topicId];
        return topic ? topic.description : `主题ID: ${topicId}`;
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string, record: WritingPractice) => (
        <Typography.Link onClick={() => fetchPracticeDetail(record.id)}>
          {text.length > 50 ? text.substring(0, 50) + '...' : text}
        </Typography.Link>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'orange';
        let text = '草稿';
        
        if (status === 'published') {
          color = 'green';
          text = '已提交';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score: number) => score || '-',
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
      width: 150,
      render: (_: any, record: WritingPractice) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/practice/writing/view/${record.id}`)}
          />
          {record.status === 'draft' && (
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/practice/writing/edit/${record.id}`)}
            />
          )}
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
    <Card title="写作练习管理">
      {/* 搜索表单 */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="status" label="状态">
          <Select
            placeholder="请选择状态"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'draft', label: '草稿' },
              { value: 'published', label: '已提交' },
            ]}
          />
        </Form.Item>
        <Form.Item name="topicId" label="主题描述">
          <Select
            placeholder="请选择主题"
            allowClear
            showSearch
            loading={topicsLoading}
            style={{ width: 200 }}
            optionFilterProp="label"
            options={allTopics.map(topic => ({
              value: topic.id,
              label: topic.description,
            }))}
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
              onClick={() => navigate('/practice/writing/create')}
            >
              新建写作练习
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
        dataSource={practices}
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
        title="写作练习详情"
        open={detailVisible}
        onCancel={handleDetailClose}
        footer={[
          <Button key="close" onClick={handleDetailClose}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>加载中...</div>
        ) : currentPractice ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{currentPractice.id}</Descriptions.Item>
            <Descriptions.Item label="主题描述">
              {topicsMap[currentPractice.topicId] 
                ? topicsMap[currentPractice.topicId].description 
                : `主题ID: ${currentPractice.topicId}`}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {currentPractice.status === 'draft' ? (
                <Tag color="orange">草稿</Tag>
              ) : (
                <Tag color="green">已提交</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="内容">
              <div style={{ whiteSpace: 'pre-wrap' }}>{currentPractice.content}</div>
            </Descriptions.Item>
            <Descriptions.Item label="分数">
              {currentPractice.score || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(currentPractice.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {dayjs(currentPractice.updateTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>暂无数据</div>
        )}
      </Modal>
    </Card>
  );
};

export default WritingPracticeListPage;