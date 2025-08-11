import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography, Tag, Button, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getGrammarAnalysis } from '@/api/grammarAnalysis';
import { GrammarAnalysis } from '@/types/grammar-analysis';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';

const { Title, Paragraph } = Typography;

// 初始化Markdown解析器
const mdParser = new MarkdownIt();

const GrammarAnalysisDetailPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [grammarAnalysis, setGrammarAnalysis] = useState<GrammarAnalysis | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setLoading(true);
            getGrammarAnalysis(Number(id))
                .then(res => {
                    if (res.data.success) {
                        setGrammarAnalysis(res.data.data);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    // 返回列表页
    const handleBack = () => {
        navigate('/content/grammar-analysis');
    };

    // 渲染难度标签
    const renderDifficultyTag = (difficulty: string) => {
        const difficultyMap: { [key: string]: { text: string; color: string } } = {
            'easy': { text: '简单', color: 'green' },
            'medium': { text: '中等', color: 'orange' },
            'hard': { text: '困难', color: 'red' }
        };
        const config = difficultyMap[difficulty] || { text: difficulty, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // 渲染Markdown内容
    const renderMarkdownContent = (content: string) => {
        const htmlContent = mdParser.render(content);
        return (
            <div 
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    minHeight: '300px'
                }}
            />
        );
    };

    return (
        <div
            style={{
                maxWidth: '100%',
                margin: '0 auto',
                padding: '0 8px',
                boxSizing: 'border-box',
                width: '100%'
            }}
        >
            <Card
                title="语法分析详情"
                extra={
                    <Button 
                        type="primary" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={handleBack}
                    >
                        返回
                    </Button>
                }
            >
                <Spin spinning={loading}>
                    {grammarAnalysis && (
                        <div>
                            {/* 标题 */}
                            <div style={{ marginBottom: 16 }}>
                                <Title level={4} style={{ marginBottom: 8 }}>标题</Title>
                                <Paragraph style={{ fontSize: '16px', fontWeight: 500 }}>
                                    {grammarAnalysis.title}
                                </Paragraph>
                            </div>

                            {/* 难度级别 */}
                            <div style={{ marginBottom: 24 }}>
                                <Title level={4} style={{ marginBottom: 8 }}>难度级别</Title>
                                {renderDifficultyTag(grammarAnalysis.difficulty)}
                            </div>

                            {/* 内容 */}
                            <div style={{ marginBottom: 24 }}>
                                <Title level={4} style={{ marginBottom: 8 }}>内容</Title>
                                {grammarAnalysis.originContent ? 
                                    renderMarkdownContent(grammarAnalysis.originContent) : 
                                    <div style={{ color: '#999', fontStyle: 'italic' }}>暂无内容</div>
                                }
                            </div>

                            {/* 时间信息 */}
                            <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                                <Space direction="vertical" size={8}>
                                    {grammarAnalysis.createTime && (
                                        <div>
                                            <span style={{ color: '#666', marginRight: 8 }}>创建时间:</span>
                                            <span>{grammarAnalysis.createTime}</span>
                                        </div>
                                    )}
                                    {grammarAnalysis.updateTime && (
                                        <div>
                                            <span style={{ color: '#666', marginRight: 8 }}>更新时间:</span>
                                            <span>{grammarAnalysis.updateTime}</span>
                                        </div>
                                    )}
                                </Space>
                            </div>
                        </div>
                    )}
                </Spin>
            </Card>
        </div>
    );
};

export default GrammarAnalysisDetailPage;