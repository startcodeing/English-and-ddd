import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Input, Select } from 'antd';
import { getGrammarAnalyses, countGrammarAnalyses, deleteGrammarAnalysis } from '@/api/grammarAnalysis';
import { GrammarAnalysis } from '@/types/grammar-analysis';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

const GrammarAnalysisListPage: React.FC = () => {
    const [grammarAnalyses, setGrammarAnalyses] = useState<GrammarAnalysis[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const fetchGrammarAnalyses = async () => {
        setLoading(true);
        try {
            const res = await getGrammarAnalyses({ title: searchTerm, difficulty, page: page - 1, size: pageSize });
            if (res.data.success) {
                setGrammarAnalyses(res.data.data);
                const countRes = await countGrammarAnalyses({ title: searchTerm, difficulty });
                if (countRes.data.success) {
                    setTotal(countRes.data.data);
                }
            }
        } catch (error) {
            message.error('Failed to fetch grammar analyses');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchGrammarAnalyses();
    }, [page, pageSize, searchTerm, difficulty]);

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this grammar analysis?',
            onOk: async () => {
                try {
                    await deleteGrammarAnalysis(id);
                    message.success('Grammar analysis deleted successfully');
                    fetchGrammarAnalyses();
                } catch (error) {
                    message.error('Failed to delete grammar analysis');
                }
            },
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
        { title: 'Create Time', dataIndex: 'createTime', key: 'createTime' },
        { title: 'Update Time', dataIndex: 'updateTime', key: 'updateTime' },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: GrammarAnalysis) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => navigate(`/content/grammar-analysis/edit/${record.id}`)}>Edit</Button>
                    <Button type="primary" danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Search placeholder="Search by title" onSearch={setSearchTerm} style={{ width: 200 }} />
                <Select placeholder="Select difficulty" onChange={setDifficulty} style={{ width: 120 }} allowClear>
                    <Option value="easy">Easy</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="hard">Hard</Option>
                </Select>
                <Button type="primary" onClick={() => navigate('/content/grammar-analysis/new')}>New Grammar Analysis</Button>
            </Space>
            <Table
                columns={columns}
                dataSource={grammarAnalyses}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: total,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize || 10);
                    },
                }}
            />
        </div>
    );
};

export default GrammarAnalysisListPage;