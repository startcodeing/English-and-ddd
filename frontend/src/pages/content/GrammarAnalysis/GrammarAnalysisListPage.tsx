import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Input, Select, Form, Card, Row, Col, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getGrammarAnalyses, countGrammarAnalyses, deleteGrammarAnalysis, batchDeleteGrammarAnalyses } from '@/api/grammarAnalysis';
import { GrammarAnalysis } from '@/types/grammar-analysis';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { confirm } = Modal;

const GrammarAnalysisListPage: React.FC = () => {
    const [form] = Form.useForm();
    const [grammarAnalyses, setGrammarAnalyses] = useState<GrammarAnalysis[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchParams, setSearchParams] = useState<{ title?: string; difficulty?: string }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const navigate = useNavigate();

    const fetchGrammarAnalyses = async () => {
        setLoading(true);
        try {
            const res = await getGrammarAnalyses({ 
                title: searchParams.title, 
                difficulty: searchParams.difficulty, 
                page: current - 1, 
                size: pageSize 
            });
            if (res.data.success) {
                const grammarAnalysesData = res.data.data || [];
                setGrammarAnalyses(Array.isArray(grammarAnalysesData) ? grammarAnalysesData : []);
                const countRes = await countGrammarAnalyses({ 
                    title: searchParams.title, 
                    difficulty: searchParams.difficulty 
                });
                if (countRes.data.success) {
                    setTotal(countRes.data.data || 0);
                }
            } else {
                message.error(res.data.message || '获取语法分析列表失败');
            }
        } catch (error) {
            console.error('获取语法分析列表失败:', error);
            message.error('获取语法分析列表失败');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchGrammarAnalyses();
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

    const handleDelete = (id: number) => {
        confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined />,
            content: '确定要删除这个语法分析吗？此操作不可恢复。',
            onOk: async () => {
                try {
                    const res = await deleteGrammarAnalysis(id);
                    if (res.data.success) {
                        message.success('语法分析删除成功');
                        fetchGrammarAnalyses();
                    } else {
                        message.error(res.data.message || '删除失败');
                    }
                } catch (error) {
                    message.error('删除语法分析失败');
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
            content: `确定要删除选中的 ${ids.length} 个语法分析吗？此操作不可恢复。`,
            onOk: async () => {
                try {
                    const res = await batchDeleteGrammarAnalyses(ids);
                    if (res.data.success) {
                        message.success('批量删除成功');
                        fetchGrammarAnalyses();
                        setSelectedRowKeys([]);
                    } else {
                        message.error(res.data.message || '批量删除失败');
                    }
                } catch (error) {
                    message.error('批量删除失败');
                }
            },
        });
    };

    const columns = [
        { 
            title: 'ID', 
            dataIndex: 'id', 
            key: 'id',
            width: 80
        },
        { 
            title: '标题', 
            dataIndex: 'title', 
            key: 'title',
            ellipsis: true,
            render: (text: string, record: GrammarAnalysis) => (
                <a onClick={() => navigate(`/content/grammar-analysis/detail/${record.id}`)}>
                    {text}
                </a>
            )
        },
        { 
            title: '难度', 
            dataIndex: 'difficulty', 
            key: 'difficulty',
            width: 100,
            render: (difficulty: string | null) => {
                if (!difficulty) return '-';
                const difficultyMap: { [key: string]: string } = {
                    'easy': '简单',
                    'medium': '中等',
                    'hard': '困难'
                };
                return difficultyMap[difficulty] || difficulty;
            }
        },
        { 
            title: '创建时间', 
            dataIndex: 'createTime', 
            key: 'createTime',
            width: 180,
            render: (createTime: string | null) => {
                return createTime || '-';
            }
        },
        { 
            title: '更新时间', 
            dataIndex: 'updateTime', 
            key: 'updateTime',
            width: 180,
            render: (updateTime: string | null) => {
                return updateTime || '-';
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_: any, record: GrammarAnalysis) => (
                <Space size="middle">
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => navigate(`/content/grammar-analysis/edit/${record.id}`)}
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
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    return (
        <Card title="语法分析管理" style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
            {/* 搜索表单和操作按钮 */}
            <Row style={{ marginBottom: 16 }} justify="space-between" align="middle">
                <Col>
                    <Form
                        form={form}
                        layout="inline"
                        onFinish={handleSearch}
                    >
                        <Form.Item name="title" label="标题">
                            <Input placeholder="请输入标题" allowClear style={{ width: 200 }} />
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
                            onClick={() => navigate('/content/grammar-analysis/new')}
                        >
                            新建语法分析
                        </Button>
                        <Button
                            danger
                            disabled={selectedRowKeys.length === 0}
                            icon={<DeleteOutlined />}
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
                dataSource={grammarAnalyses}
                loading={loading}
                pagination={false}
                size="small"
                scroll={{ y: 'calc(100vh - 350px)' }}
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

export default GrammarAnalysisListPage;