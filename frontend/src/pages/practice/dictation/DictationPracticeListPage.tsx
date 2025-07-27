import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Pagination, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getDictationPractices, countDictationPractices, deleteDictationPractice, batchDeleteDictationPractices, DictationPractice, DictationPracticeQuery } from '../../../api/dictationPractice';
import { getListeningMaterialById } from '../../../api/listeningMaterial';

const { confirm } = Modal;
const { Text } = Typography;

const DictationPracticeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 状态管理
  const [practices, setPractices] = useState<DictationPractice[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<Partial<DictationPracticeQuery>>({});
  const [materialsMap, setMaterialsMap] = useState<Record<number, any>>({});
  const [searchParams, setSearchParams] = useState<DictationPracticeQuery>({});

  // 获取听写练习列表
  const fetchPractices = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // 构建查询参数
      const queryParams: DictationPracticeQuery = {
        pageNum: page,
        pageSize,
        ...filters
      };

      // 并行请求听写练习列表和总数
      const [practicesResponse, countResponse] = await Promise.all([
        getDictationPractices(queryParams),
        countDictationPractices(queryParams)
      ]);

      // 检查听写练习列表请求是否成功
      if (practicesResponse.success) {
        const practicesList = practicesResponse.data || [];
        setPractices(practicesList);
        
        // 获取所有听力资料信息
        fetchMaterialsInfo(practicesList);
      } else {
        message.error(practicesResponse.message || '获取听写练习列表失败');
        setPractices([]);
      }

      // 检查总数请求是否成功
      if (countResponse.success) {
        setTotal(countResponse.data || 0);
      } else {
        message.error(countResponse.message || '获取听写练习总数失败');
        setTotal(0);
      }
    } catch (error: any) {
      console.error('获取听写练习列表失败:', error);
      message.error(error.message || '获取听写练习列表失败');
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取听力资料信息
  const fetchMaterialsInfo = async (practicesList: DictationPractice[]) => {
    try {
      // 获取不重复的听力资料ID列表
      const materialIds = Array.from(new Set(practicesList.map(practice => practice.listenMaterialId)));
      
      // 过滤掉已经获取过的资料
      const newMaterialIds = materialIds.filter(id => !materialsMap[id]);
      
      if (newMaterialIds.length === 0) return;
      
      // 并行获取所有听力资料信息
      const materialPromises = newMaterialIds.map(id => getListeningMaterialById(id.toString()));
      const materialResponses = await Promise.all(materialPromises);
      
      // 更新听力资料映射
      const newMaterialsMap = { ...materialsMap };
      materialResponses.forEach((response, index) => {
        if (response.success && response.data) {
          newMaterialsMap[newMaterialIds[index]] = response.data;
        }
      });
      
      setMaterialsMap(newMaterialsMap);
    } catch (error) {
      console.error('获取听力资料信息出错:', error);
    }
  };

  // 组件挂载和筛选条件变化时获取数据
  useEffect(() => {
    fetchPractices(current, pageSize);
  }, [current, pageSize, filters]);

  // 处理搜索
  const handleSearch = (values: any) => {
    setCurrent(1); // 重置到第一页
    setFilters(values);
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    setFilters({});
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
    fetchPractices(page, pageSize || 10);
  };

  // 删除听写练习
  const handleDelete = (id: number) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个听写练习吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const response = await deleteDictationPractice(id);
          if (response.success) {
            message.success('删除成功');
            fetchPractices();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          console.error('删除听写练习出错:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 批量删除听写练习
  const handleBatchDelete = (ids: number[]) => {
    if (ids.length === 0) {
      message.warning('请选择要删除的项目');
      return;
    }

    confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${ids.length} 个听写练习吗？此操作不可恢复。`,
      onOk: async () => {
        try {
          const response = await batchDeleteDictationPractices(ids);
          if (response.success) {
            message.success('批量删除成功');
            fetchPractices();
            setSelectedRowKeys([]);
          } else {
            message.error(response.message || '批量删除失败');
          }
        } catch (error) {
          console.error('批量删除听写练习出错:', error);
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
      title: '听力资料',
      dataIndex: 'listenMaterialId',
      key: 'listenMaterialId',
      width: 200,
      ellipsis: true,
      render: (materialId: number) => {
        const material = materialsMap[materialId];
        return material ? material.title : `资料ID: ${materialId}`;
      },
    },
    {
      title: '难度',
      dataIndex: 'listenMaterialId',
      key: 'difficulty',
      width: 100,
      render: (materialId: number) => {
        const material = materialsMap[materialId];
        if (!material) return '-';
        
        let color = 'blue';
        let text = material.difficulty;
        
        if (material.difficulty === 'BEGINNER') {
          color = 'green';
          text = '初级';
        } else if (material.difficulty === 'INTERMEDIATE') {
          color = 'orange';
          text = '中级';
        } else if (material.difficulty === 'ADVANCED') {
          color = 'red';
          text = '高级';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string, record: DictationPractice) => (
        <Typography.Link onClick={() => navigate(`/practice/dictation/view/${record.id}`)}>
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
        
        if (status === 'submitted') {
          color = 'green';
          text = '已提交';
        } else if (status === 'scored') {
          color = 'blue';
          text = '已评分';
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
      render: (_: any, record: DictationPractice) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/practice/dictation/view/${record.id}`)}
          />
          {record.status === 'draft' && (
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/practice/dictation/edit/${record.id}`)}
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
    <Card title="听写练习管理">
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
              { value: 'submitted', label: '已提交' },
              { value: 'scored', label: '已评分' },
            ]}
          />
        </Form.Item>
        <Form.Item name="listenMaterialId" label="听力资料">
          <Select
            placeholder="请选择听力资料"
            allowClear
            showSearch
            style={{ width: 200 }}
            optionFilterProp="label"
            options={Object.values(materialsMap).map((material: any) => ({
              value: material.id,
              label: material.title,
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
              onClick={() => navigate('/practice/dictation/create')}
            >
              新建听写练习
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
    </Card>
  );
};

export default DictationPracticeListPage;