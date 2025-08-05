import React, { useEffect, useState } from 'react';
import { Button, Modal, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getDictationPractices, countDictationPractices, deleteDictationPractice, batchDeleteDictationPractices, DictationPractice, DictationPracticeQuery } from '../../../api/dictationPractice';
import { getListeningMaterialById } from '../../../api/listeningMaterial';
import { UnifiedListPage, TableColumn, FilterOption, BatchAction, HeaderAction, ActionButton } from '../../../components/unified/UnifiedListPage';
import './style.css';

const { confirm } = Modal;

const DictationPracticeListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [practices, setPractices] = useState<DictationPractice[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<Partial<DictationPracticeQuery>>({});
  const [materialsMap, setMaterialsMap] = useState<Record<number, any>>({});

  // 获取听写练习列表
  const fetchPractices = async (page = current, size = pageSize, searchFilters = filters) => {
    setLoading(true);
    try {
      // 构建查询参数
      const queryParams: DictationPracticeQuery = {
        pageNum: page,
        pageSize: size,
        ...searchFilters
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

  // 组件挂载时获取数据
  useEffect(() => {
    fetchPractices();
  }, []);

  // 处理搜索
  const handleSearch = (searchText: string, dataSource: DictationPractice[]): DictationPractice[] => {
    if (!searchText) {
      return dataSource;
    }
    return dataSource.filter(item => 
      item.content?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // 处理搜索输入变化
  const handleSearchChange = (searchText: string) => {
    // 由于DictationPracticeQuery接口不支持content字段，这里只更新本地搜索
    // 实际的搜索逻辑由UnifiedListPage的onSearch处理
    setCurrent(1);
    fetchPractices(1, pageSize, filters);
  };

  // 重置搜索
  const handleReset = () => {
    setFilters({});
    setCurrent(1);
    fetchPractices(1, pageSize, {});
  };

  // 处理分页变化
  const handlePageChange = (page: number, size?: number) => {
    setCurrent(page);
    if (size) {
      setPageSize(size);
    }
    fetchPractices(page, size || pageSize);
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
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    const ids = selectedRowKeys.map(key => Number(key));
    try {
      const response = await batchDeleteDictationPractices(ids);
      if (response.success) {
        message.success('批量删除成功');
        fetchPractices();
      } else {
        message.error(response.message || '批量删除失败');
      }
    } catch (error) {
      console.error('批量删除听写练习出错:', error);
      message.error('批量删除失败');
    }
  };

  // 表格列定义
  const columns: TableColumn[] = [
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
          {text && text.length > 50 ? text.substring(0, 50) + '...' : text || '-'}
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

  ];

  // 筛选选项
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已提交', value: 'submitted' },
        { label: '已评分', value: 'scored' }
      ]
    }
  ];

  // 批量操作
  const batchActions: BatchAction[] = [
    {
      key: 'delete',
      label: '批量删除',
      danger: true,
      onClick: handleBatchDelete
    }
  ];

  // 头部操作
  const headerActions: HeaderAction[] = [
    {
      key: 'create',
      label: '添加听写练习',
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => navigate('/practice/dictation/create')
    }
  ];

  // 操作按钮
  const actionButtons: ActionButton[] = [
    {
      key: 'view',
      label: '查看',
      icon: <EyeOutlined />,
      onClick: (record: DictationPractice) => navigate(`/practice/dictation/view/${record.id}`)
    },
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: (record: DictationPractice) => navigate(`/practice/dictation/edit/${record.id}`)
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (record: DictationPractice) => handleDelete(record.id)
    }
  ];

  return (
    <UnifiedListPage<DictationPractice>
      title="听写练习管理"
      description="管理和查看听写练习记录"
      dataSource={practices}
      columns={columns}
      loading={loading}
      filterOptions={filterOptions}
      onSearch={handleSearch}
      batchActions={batchActions}
      rowKey="id"
      headerActions={headerActions}
      actionButtons={actionButtons}
      pagination={{
        current,
        pageSize,
        total,
        onChange: handlePageChange,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 个听写练习`
      }}
    />
  );
};

export default DictationPracticeListPage;