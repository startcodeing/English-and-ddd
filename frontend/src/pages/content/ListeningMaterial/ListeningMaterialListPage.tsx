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
import './style.css';

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
            type="primary" 
            size="small"
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/content/listening-materials/detail/${record.id}`)}
          >
            查看
          </Button>
          <Button 
            type="primary" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => navigate(`/content/listening-materials/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个听力资料吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="listening-material-page">
      <div className="article-page-header">
        <h1>听力资料管理</h1>
        <div className="article-page-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/content/listening-materials/create')}
          >
            添加听力资料
          </Button>
        </div>
      </div>
        
      <div className="article-page-actions" style={{ marginBottom: '16px', flexShrink: 0 }}>
        <Input
          placeholder="搜索标题"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onPressEnter={searchByTitle}
          style={{ width: 250, marginRight: 16 }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="选择难度级别"
          style={{ width: '150px', marginRight: 16 }}
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
        {selectedRowKeys.length > 0 && (
          <div className="batch-actions-area">
            <span className="selected-count">
              已选择 <span className="count-number">{selectedRowKeys.length}</span> 个听力资料
            </span>
            <Space>
              <Button size="small" onClick={() => setSelectedRowKeys([])}>清除选择</Button>
              <Popconfirm
                title="确定要删除选中的听力资料吗？"
                description="删除后将无法恢复，请谨慎操作！"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  danger 
                  size="small"
                  loading={batchDeleteLoading}
                  icon={<DeleteOutlined />}
                >
                  批量删除
                </Button>
              </Popconfirm>
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
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个听力资料`,
          position: ['bottomRight'],
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
          },
          onShowSizeChange: async (current, size) => {
            try {
              dispatch(fetchListeningMaterialsStart());
              const response = await getListeningMaterialsByPage(current, size);
              dispatch(fetchListeningMaterialsSuccess(response.data));
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