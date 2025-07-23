import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space, Input, Select, Popconfirm, message, Card, Typography, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { RootState } from '../../../types/store';
import type { ListeningMaterial } from '../../../types/listeningMaterial';
import { ListeningMaterialDifficultyLevel } from '../../../types/listeningMaterial';
import { fetchListeningMaterialsStart, fetchListeningMaterialsSuccess, fetchListeningMaterialsFailure } from '../../../store/contentSlice';
import { getAllListeningMaterials, getListeningMaterialsByPage, getListeningMaterialsByTitle, getListeningMaterialsByDifficultyLevel, deleteListeningMaterial, batchDeleteListeningMaterials } from '../../../api/listeningMaterial';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const ListeningMaterialListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.content.listeningMaterials);
  
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ListeningMaterialDifficultyLevel | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchDeleteLoading, setBatchDeleteLoading] = useState<boolean>(false);

  // 加载听力资料列表
  const loadListeningMaterials = async () => {
    try {
      dispatch(fetchListeningMaterialsStart());
      const response = await getListeningMaterialsByPage(1, 10);
      dispatch(fetchListeningMaterialsSuccess(response.data));
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
        params: { page: 1, size: 10 },
        stack: error.stack
      });
    }
  };

  // 根据标题搜索
  const searchByTitle = async () => {
    if (!searchTitle.trim()) {
      loadListeningMaterials();
      return;
    }

    try {
      dispatch(fetchListeningMaterialsStart());
      const response = await getListeningMaterialsByTitle(searchTitle);
      dispatch(fetchListeningMaterialsSuccess(response.data));
    } catch (error: any) {
      const errorMsg = error.message || '未知错误';
      const statusCode = error.response?.status || 'N/A';
      dispatch(fetchListeningMaterialsFailure(errorMsg));
      message.error(`搜索听力资料失败: ${errorMsg}，状态码: ${statusCode}`);
      console.error('Search by title error:', error);
      console.error('Error details:', {
        message: errorMsg,
        statusCode,
        endpoint: 'getListeningMaterialsByTitle',
        params: { title: searchTitle },
        stack: error.stack
      });
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
      dispatch(fetchListeningMaterialsSuccess(response.data));
    } catch (error: any) {
      const errorMsg = error.message || '未知错误';
      const statusCode = error.response?.status || 'N/A';
      dispatch(fetchListeningMaterialsFailure(errorMsg));
      message.error(`筛选听力资料失败: ${errorMsg}，状态码: ${statusCode}`);
      console.error('Filter by difficulty error:', error);
      console.error('Error details:', {
        message: errorMsg,
        statusCode,
        endpoint: 'getListeningMaterialsByDifficultyLevel',
        params: { difficulty: selectedDifficulty },
        stack: error.stack
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
      const errorMsg = error.message || '未知错误';
      const statusCode = error.response?.status || 'N/A';
      message.error(`删除失败: ${errorMsg}，状态码: ${statusCode}`);
      console.error('Delete listening material error:', error);
      console.error('Error details:', {
        message: errorMsg,
        statusCode,
        endpoint: 'deleteListeningMaterial',
        params: { id },
        stack: error.stack
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
      const errorMsg = error.message || '未知错误';
      const statusCode = error.response?.status || 'N/A';
      message.error(`批量删除失败: ${errorMsg}，状态码: ${statusCode}`);
      console.error('Batch delete listening materials error:', error);
      console.error('Error details:', {
        message: errorMsg,
        statusCode,
        endpoint: 'batchDeleteListeningMaterials',
        params: { ids: selectedRowKeys },
        stack: error.stack
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
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => {
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ListeningMaterial) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/content/listening-materials/detail/${record.id}`)}
          />
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
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={4}>听力资料管理</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/content/listening-materials/create')}
          >
            添加听力资料
          </Button>
        </div>
        
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
          <Input
            placeholder="搜索标题"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            style={{ width: '200px' }}
            suffix={<SearchOutlined onClick={searchByTitle} />}
            onPressEnter={searchByTitle}
          />
          <Select
            placeholder="选择难度级别"
            style={{ width: '150px' }}
            value={selectedDifficulty || undefined}
            onChange={(value) => {
              setSelectedDifficulty(value);
              setTimeout(filterByDifficulty, 0);
            }}
            allowClear
            dropdownMatchSelectWidth={false}
          >
            <Option value={ListeningMaterialDifficultyLevel.EASY}>初级</Option>
            <Option value={ListeningMaterialDifficultyLevel.MEDIUM}>中级</Option>
            <Option value={ListeningMaterialDifficultyLevel.HARD}>高级</Option>
          </Select>
          <Button onClick={loadListeningMaterials}>重置</Button>
          <Popconfirm
            title="确定要删除选中的听力资料吗？"
            description="删除后将无法恢复，请谨慎操作！"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
            disabled={selectedRowKeys.length === 0}
          >
            <Button 
              danger 
              loading={batchDeleteLoading}
              disabled={selectedRowKeys.length === 0}
              icon={<DeleteOutlined />}
            >
              批量删除({selectedRowKeys.length})
            </Button>
          </Popconfirm>
        </div>
        
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={items}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            onChange: async (page, pageSize) => {
              try {
                dispatch(fetchListeningMaterialsStart());
                const response = await getListeningMaterialsByPage(page, pageSize);
                dispatch(fetchListeningMaterialsSuccess(response.data));
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
                  params: { page, pageSize },
                  stack: error.stack
                });
              }
            }
          }}
        />
      </Card>
    </div>
  );
};

export default ListeningMaterialListPage;