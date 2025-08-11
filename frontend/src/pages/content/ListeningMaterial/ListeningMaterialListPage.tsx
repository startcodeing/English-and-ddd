import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space, Input, Select, Popconfirm, message, Card, Typography, Tag, Form, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { RootState } from '../../../types/store';
import type { ListeningMaterial } from '../../../types/listeningMaterial';
import { ListeningMaterialDifficultyLevel } from '../../../types/listeningMaterial';
import { fetchListeningMaterialsStart, fetchListeningMaterialsSuccess, fetchListeningMaterialsFailure, setListeningMaterialsTotal } from '../../../store/contentSlice';
import { getAllListeningMaterials, getListeningMaterialsByPage, getListeningMaterialsByTitle, getListeningMaterialsByDifficultyLevel, deleteListeningMaterial, batchDeleteListeningMaterials, countListeningMaterials } from '../../../api/listeningMaterial';
import dayjs from 'dayjs';
import './style.css';

const { Title } = Typography;
const { Option } = Select;

const ListeningMaterialListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, total } = useSelector((state: RootState) => state.content.listeningMaterials);
  
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ListeningMaterialDifficultyLevel | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchDeleteLoading, setBatchDeleteLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [form] = Form.useForm();

  // 加载听力资料列表
  const loadListeningMaterials = async () => {
    try {
      dispatch(fetchListeningMaterialsStart());
      // 同时获取分页数据和总记录数
      const [pageResponse, countResponse] = await Promise.all([
         getListeningMaterialsByPage(currentPage, pageSize),
         countListeningMaterials()
       ]);
      // 确保正确提取数据
      const listeningMaterialsData = pageResponse.data || pageResponse.data || [];
      dispatch(fetchListeningMaterialsSuccess(Array.isArray(listeningMaterialsData) ? listeningMaterialsData : []));
      if (countResponse.success && typeof countResponse.data === 'number') {
        dispatch(setListeningMaterialsTotal(countResponse.data));
      }
    } catch (error: any) {
      const errorMsg = error.message || '未知错误';
      const statusCode = error.response?.status || 'N/A';
      dispatch(fetchListeningMaterialsFailure(errorMsg));
      message.error(`加载听力资料失败: ${errorMsg}，状态码: ${statusCode}`);
      console.error('Load listening materials error:', error);
      console.error('Error details:', {
        message: errorMsg,
        statusCode,
        endpoint: 'getListeningMaterialsByPage',
        params: { page: 1, pageSize: 10 },
        stack: error.stack
      });
    }
  };

  // 处理搜索
  const handleSearch = async (values: any) => {
    const { title, difficulty } = values;
    
    if (title && title.trim()) {
      try {
        dispatch(fetchListeningMaterialsStart());
        const response = await getListeningMaterialsByTitle(title);
        const listeningMaterialsData = response.data || [];
        dispatch(fetchListeningMaterialsSuccess(Array.isArray(listeningMaterialsData) ? listeningMaterialsData : []));
      } catch (error: any) {
        const errorMsg = error?.message || '未知错误';
        const statusCode = error?.response?.status || 'N/A';
        dispatch(fetchListeningMaterialsFailure(errorMsg));
        message.error(`搜索听力资料失败: ${errorMsg}，状态码: ${statusCode}`);
        console.error('Search by title error:', error);
      }
    } else if (difficulty) {
      try {
        dispatch(fetchListeningMaterialsStart());
        let difficultyLevel;
        if (difficulty === 'beginner') difficultyLevel = ListeningMaterialDifficultyLevel.EASY;
        else if (difficulty === 'intermediate') difficultyLevel = ListeningMaterialDifficultyLevel.MEDIUM;
        else if (difficulty === 'advanced') difficultyLevel = ListeningMaterialDifficultyLevel.HARD;
        
        if (difficultyLevel) {
          const response = await getListeningMaterialsByDifficultyLevel(difficultyLevel);
          const listeningMaterialsData = response.data || [];
          dispatch(fetchListeningMaterialsSuccess(Array.isArray(listeningMaterialsData) ? listeningMaterialsData : []));
        }
      } catch (error: any) {
        const errorMsg = error?.message || '未知错误';
        const statusCode = error?.response?.status || 'N/A';
        dispatch(fetchListeningMaterialsFailure(errorMsg));
        message.error(`筛选听力资料失败: ${errorMsg}，状态码: ${statusCode}`);
        console.error('Filter by difficulty error:', error);
      }
    } else {
      loadListeningMaterials();
    }
  };

  // 根据难度级别筛选
  const filterByDifficulty = async () => {
    if (!selectedDifficulty) {
      loadListeningMaterials();
      return;
    }

    try {
      dispatch(fetchListeningMaterialsStart());
      const response = await getListeningMaterialsByDifficultyLevel(selectedDifficulty as ListeningMaterialDifficultyLevel);
      const listeningMaterialsData = response.data || [];
      dispatch(fetchListeningMaterialsSuccess(Array.isArray(listeningMaterialsData) ? listeningMaterialsData : []));
    } catch (error: any) {
      const errorMsg = error?.message || '未知错误';
      const statusCode = error?.response?.status || 'N/A';
      dispatch(fetchListeningMaterialsFailure(errorMsg));
      message.error(`筛选听力资料失败: ${errorMsg}，状态码: ${statusCode}`);
      console.error('Filter by difficulty error:', error);
      console.error('Error details:', {
        message: errorMsg,
        statusCode,
        endpoint: 'getListeningMaterialsByDifficultyLevel',
        params: { difficulty: selectedDifficulty },
        stack: error?.stack
      });
    }
  };

  // 删除听力资料
  const handleDelete = async (id: string) => {
    try {
      await deleteListeningMaterial(id);
      message.success('删除成功');
      loadListeningMaterials();
    } catch (error: any) {
      const errorMsg = error?.message || '未知错误';
      const statusCode = error?.response?.status || 'N/A';
      message.error(`删除失败: ${errorMsg}，状态码: ${statusCode}`);
      console.error('Delete listening material error:', error);
      console.error('Error details:', {
        message: errorMsg,
        statusCode,
        endpoint: 'deleteListeningMaterial',
        params: { id },
        stack: error?.stack
      });
    }
  };
  
  // 批量删除听力资料
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一项进行删除');
      return;
    }
    
    try {
      setBatchDeleteLoading(true);
      await batchDeleteListeningMaterials(selectedRowKeys as string[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      loadListeningMaterials();
    } catch (error: any) {
      const errorMsg = error?.message || '未知错误';
      const statusCode = error?.response?.status || 'N/A';
      message.error(`批量删除失败: ${errorMsg}，状态码: ${statusCode}`);
      console.error('Batch delete listening materials error:', error);
      console.error('Error details:', {
        message: errorMsg,
        statusCode,
        endpoint: 'batchDeleteListeningMaterials',
        params: { ids: selectedRowKeys },
        stack: error?.stack
      });
    } finally {
      setBatchDeleteLoading(false);
    }
  };
  
  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  // 初始加载
  useEffect(() => {
    loadListeningMaterials();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: ListeningMaterial) => (
        <a href="#" onClick={(e) => {
          e.preventDefault();
          navigate(`/content/listening-materials/detail/${record.id}`);
        }}>{text}</a>
      ),
    },
    {
      title: '难度级别',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (level: ListeningMaterialDifficultyLevel) => {
        let color = 'green';
        let text = '初级';
        
        if (level === ListeningMaterialDifficultyLevel.MEDIUM) {
          color = 'orange';
          text = '中级';
        } else if (level === ListeningMaterialDifficultyLevel.HARD) {
          color = 'red';
          text = '高级';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '音频时长',
      dataIndex: 'durationInSeconds',
      key: 'durationInSeconds',
      render: (duration: number) => {
        if (!duration) return '未知';
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      },
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => {
        const kb = size / 1024;
        if (kb < 1024) {
          return `${kb.toFixed(2)} KB`;
        } else {
          return `${(kb / 1024).toFixed(2)} MB`;
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '未知',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: ListeningMaterial) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/content/listening-materials/edit/${record.id}`)}
          />
          <Popconfirm
            title="确定要删除这个听力资料吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="listening-material-page">
      <div className="article-page-header">
        <h1>听力资料管理</h1>
      </div>
      
      <div className="search-form">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Form form={form} layout="inline" onFinish={handleSearch}>
              <Form.Item name="title" label="标题">
                <Input placeholder="请输入标题" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="difficulty" label="难度">
                <Select
                  placeholder="请选择难度"
                  allowClear
                  style={{ width: 120 }}
                  options={[
                    { value: 'beginner', label: '初级' },
                    { value: 'intermediate', label: '中级' },
                    { value: 'advanced', label: '高级' },
                  ]}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={loadListeningMaterials}>重置</Button>
              </Form.Item>
            </Form>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => navigate('/content/listening-materials/create')}
              >
                新增听力资料
              </Button>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title="确定要删除选中的听力资料吗？"
                  description="删除后将无法恢复，请谨慎操作！"
                  onConfirm={handleBatchDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button 
                    danger 
                    loading={batchDeleteLoading}
                    icon={<DeleteOutlined />}
                  >
                    批量删除 ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>
        {selectedRowKeys.length > 0 && (
          <div className="batch-actions-area">
            <span className="selected-count">
              已选择 <span className="count-number">{selectedRowKeys.length}</span> 个听力资料
            </span>
            <Space>
              <Button size="small" onClick={() => setSelectedRowKeys([])}>清除选择</Button>
            </Space>
          </div>
        )}
      </div>
      
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个听力资料`,
          position: ['bottomRight'],
          onChange: async (page, size) => {
            try {
              setCurrentPage(page);
              setPageSize(size);
              dispatch(fetchListeningMaterialsStart());
              const [pageResponse, countResponse] = await Promise.all([
                getListeningMaterialsByPage(page, size),
                countListeningMaterials()
              ]);
              const listeningMaterialsData = pageResponse.data || [];
              dispatch(fetchListeningMaterialsSuccess(Array.isArray(listeningMaterialsData) ? listeningMaterialsData : []));
              if (countResponse.success && typeof countResponse.data === 'number') {
                dispatch(setListeningMaterialsTotal(countResponse.data));
              }
            } catch (error: any) {
              const errorMsg = error.message || '未知错误';
              const statusCode = error.response?.status || 'N/A';
              dispatch(fetchListeningMaterialsFailure(errorMsg));
              message.error(`加载听力资料失败: ${errorMsg}，状态码: ${statusCode}`);
              console.error('Pagination error:', error);
              console.error('Error details:', {
                message: errorMsg,
                statusCode,
                endpoint: 'getListeningMaterialsByPage',
                params: { page, pageSize: size },
                stack: error.stack
              });
            }
          },
          onShowSizeChange: async (current, size) => {
            try {
              setCurrentPage(current);
              setPageSize(size);
              dispatch(fetchListeningMaterialsStart());
              const [pageResponse, countResponse] = await Promise.all([
                getListeningMaterialsByPage(current, size),
                countListeningMaterials()
              ]);
              const listeningMaterialsData = pageResponse.data || [];
              dispatch(fetchListeningMaterialsSuccess(Array.isArray(listeningMaterialsData) ? listeningMaterialsData : []));
              if (countResponse.success && typeof countResponse.data === 'number') {
                dispatch(setListeningMaterialsTotal(countResponse.data));
              }
            } catch (error: any) {
              const errorMsg = error.message || '未知错误';
              const statusCode = error.response?.status || 'N/A';
              dispatch(fetchListeningMaterialsFailure(errorMsg));
              message.error(`加载听力资料失败: ${errorMsg}，状态码: ${statusCode}`);
              console.error('Page size change error:', error);
            }
          },
          style: { marginBottom: 0 }
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ListeningMaterialListPage;