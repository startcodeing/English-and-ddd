import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Popconfirm, message, Tag, Space } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { UnifiedListPage, TableColumn, FilterOption, BatchAction } from '../../../components/unified/UnifiedListPage';
import { RootState } from '../../../types/store';
import type { ListeningMaterial } from '../../../types/listeningMaterial';
import { ListeningMaterialDifficultyLevel } from '../../../types/listeningMaterial';
import { fetchListeningMaterialsStart, fetchListeningMaterialsSuccess, fetchListeningMaterialsFailure } from '../../../store/contentSlice';
import { getAllListeningMaterials, getListeningMaterialsByPage, getListeningMaterialsByTitle, getListeningMaterialsByDifficultyLevel, deleteListeningMaterial, batchDeleteListeningMaterials } from '../../../api/listeningMaterial';
import dayjs from 'dayjs';
import './style.css';

const { Option } = Select;

const ListeningMaterialListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.content.listeningMaterials);
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<ListeningMaterialDifficultyLevel | null>(null);
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
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    try {
      setBatchDeleteLoading(true);
      await batchDeleteListeningMaterials(selectedRowKeys as string[]);
      message.success('批量删除成功');
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
  
  // 搜索过滤函数
  const handleSearch = (searchText: string, dataSource: ListeningMaterial[]) => {
    return dataSource.filter(material =>
      material?.title?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // 初始加载
  useEffect(() => {
    loadListeningMaterials();
  }, []);

  // 表格列定义
  const columns: TableColumn[] = [
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
  ];

  // 搜索过滤选项
  const filterOptions: FilterOption[] = [
    {
      key: 'search',
      label: '搜索听力资料',
      type: 'input',
      placeholder: '搜索标题'
    }
  ];

  // 批量操作配置
  const batchActions: BatchAction[] = [
    {
      key: 'delete',
      label: '批量删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleBatchDelete
    }
  ];

  return (
    <div className="listening-material-page">
      <UnifiedListPage<ListeningMaterial>
        title="听力资料管理"
        description="管理您的听力资料，创建、编辑和组织音频学习内容"
        dataSource={items}
        columns={columns}
        loading={loading}
        filterOptions={filterOptions}
        onSearch={handleSearch}
        batchActions={batchActions}
        rowKey="id"
        headerActions={[
          {
            key: 'add',
            label: '添加听力资料',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: () => navigate('/content/listening-materials/create'),
          },
        ]}
        actionButtons={[
          {
            key: 'view',
            label: '查看',
            icon: <EyeOutlined />,
            onClick: (record) => navigate(`/content/listening-materials/detail/${record.id}`),
          },
          {
            key: 'edit',
            label: '编辑',
            icon: <EditOutlined />,
            onClick: (record) => navigate(`/content/listening-materials/edit/${record.id}`),
          },
          {
            key: 'delete',
            label: '删除',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: (record) => handleDelete(record.id)
          }
        ]}
        pagination={{
          current: 1,
          pageSize: 10,
          total: items.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 个听力资料`
        }}
      />
    </div>
  );
};

export default ListeningMaterialListPage;