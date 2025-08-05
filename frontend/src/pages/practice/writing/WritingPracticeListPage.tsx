import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getWritingPractices, countWritingPractices, deleteWritingPractice, batchDeleteWritingPractices, WritingPractice, WritingPracticeQuery } from '../../../api/writingPractice';
import { getWritingTopicById, getWritingTopics, WritingTopic } from '../../../api/writingTopic';
import UnifiedListPage, { TableColumn, FilterOption, BatchAction, HeaderAction, ActionButton } from '../../../components/unified/UnifiedListPage';

const { confirm } = Modal;
const { Text } = Typography;

const WritingPracticeListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [practices, setPractices] = useState<WritingPractice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [topicsMap, setTopicsMap] = useState<Record<number, WritingTopic>>({});
  const [allTopics, setAllTopics] = useState<WritingTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState<boolean>(false);

  // 获取写作练习列表
  const fetchPractices = async (queryParams: WritingPracticeQuery) => {
    setLoading(true);
    try {
      // 并行请求写作练习列表和总数
      const [practicesResponse, countResponse] = await Promise.all([
        getWritingPractices(queryParams),
        countWritingPractices(queryParams)
      ]);

      // 检查写作练习列表请求是否成功
      if (practicesResponse.success) {
        const practicesList = practicesResponse.data || [];
        setPractices(practicesList);
        
        // 获取所有主题信息
        fetchTopicsInfo(practicesList);
      } else {
        message.error(practicesResponse.message || '获取写作练习列表失败');
        setPractices([]);
      }

      // 检查总数请求是否成功
      if (countResponse.success) {
        setTotal(countResponse.data || 0);
      } else {
        message.error(countResponse.message || '获取写作练习总数失败');
        setTotal(0);
      }
    } catch (error: any) {
      console.error('获取写作练习列表失败:', error);
      message.error(error.message || '获取写作练习列表失败');
      setPractices([]);
      setTotal(0);
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

  // 移除详情弹窗相关函数

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

  // 组件加载时获取所有主题和初始数据
  useEffect(() => {
    fetchAllTopics();
    fetchPractices({ pageNum: 1, pageSize: 10 });
  }, []);

  // 处理数据刷新
  const handleRefresh = () => {
    fetchAllTopics();
    fetchPractices({ pageNum: 1, pageSize: 10 });
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
            fetchPractices({ pageNum: 1, pageSize: 10 });
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
  const handleBatchDelete = async (ids: number[]) => {
    try {
      const response = await batchDeleteWritingPractices(ids);
      if (response.success) {
        message.success('批量删除成功');
        return true;
      } else {
        message.error(response.message || '批量删除失败');
        return false;
      }
    } catch (error) {
      console.error('批量删除写作练习出错:', error);
      message.error('批量删除失败');
      return false;
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
        <Typography.Link onClick={() => navigate(`/practice/writing/view/${record.id}`)}>
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
  ];

  // 筛选选项
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: [
        { value: 'draft', label: '草稿' },
        { value: 'published', label: '已提交' },
      ],
    },
    {
      key: 'topicId',
      label: '主题描述',
      type: 'select',
      options: allTopics.map(topic => ({
        value: topic.id,
        label: topic.description,
      })),
    },
  ];

  // 批量操作
  const batchActions: BatchAction[] = [
    {
      key: 'delete',
      label: '批量删除',
      danger: true,
      onClick: (selectedRowKeys: React.Key[]) => {
        const ids = selectedRowKeys as number[];
        confirm({
          title: '确认批量删除',
          icon: <ExclamationCircleOutlined />,
          content: `确定要删除选中的 ${ids.length} 个写作练习吗？此操作不可恢复。`,
          onOk: async () => {
            const success = await handleBatchDelete(ids);
            if (success) {
              fetchPractices({ pageNum: 1, pageSize: 10 });
            }
          },
        });
      },
    },
  ];

  // 头部操作
  const headerActions: HeaderAction[] = [
    {
      key: 'create',
      label: '新建写作练习',
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => navigate('/practice/writing/create'),
    },
  ];

  // 操作按钮
  const actionButtons: ActionButton[] = [
    {
      key: 'view',
      label: '查看',
      icon: <EyeOutlined />,
      onClick: (record: WritingPractice) => navigate(`/practice/writing/view/${record.id}`),
    },
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: (record: WritingPractice) => {
        if (record.status === 'draft') {
          navigate(`/practice/writing/edit/${record.id}`);
        }
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (record: WritingPractice) => {
        confirm({
          title: '确认删除',
          icon: <ExclamationCircleOutlined />,
          content: '确定要删除这个写作练习吗？此操作不可恢复。',
          onOk: async () => {
            try {
              const response = await deleteWritingPractice(record.id);
              if (response.success) {
                message.success('删除成功');
                fetchPractices({ pageNum: 1, pageSize: 10 });
              } else {
                message.error(response.message || '删除失败');
              }
            } catch (error) {
              console.error('删除写作练习出错:', error);
              message.error('删除失败');
            }
          },
        });
      },
    },
  ];

  return (
    <UnifiedListPage<WritingPractice>
      title="写作练习管理"
      description="管理和查看所有写作练习记录"
      dataSource={practices}
      columns={columns}
      loading={loading}
      filterOptions={filterOptions}
      batchActions={batchActions}
      rowKey="id"
      headerActions={headerActions}
      actionButtons={actionButtons}
      pagination={{
        current: 1,
        pageSize: 10,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条记录`,
        onChange: (page: number, pageSize?: number) => {
          fetchPractices({ pageNum: page, pageSize: pageSize || 10 });
        },
      }}
      onSearch={(searchText: string, dataSource: WritingPractice[]) => {
        if (!searchText) return dataSource;
        return dataSource.filter(practice => 
          practice.content?.toLowerCase().includes(searchText.toLowerCase())
        );
      }}
    />
  );
};

export default WritingPracticeListPage;