import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Select, message, Card, Space, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getGrammarAnalysis, createGrammarAnalysis, updateGrammarAnalysis } from '@/api/grammarAnalysis';
import { GrammarAnalysis } from '@/types/grammar-analysis';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const { Option } = Select;

// 初始化Markdown解析器
const mdParser = new MarkdownIt();

const GrammarAnalysisFormPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editorContent, setEditorContent] = useState('');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;
    
    // 添加页面容器的引用，用于处理溢出问题
    const pageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            getGrammarAnalysis(Number(id)).then(res => {
                if (res.data.success) {
                    const data = res.data.data;
                    form.setFieldsValue({
                        title: data.title,
                        difficulty: data.difficulty
                    });
                    setEditorContent(data.originContent || '');
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [id, isEdit, form]);

    // 处理编辑器内容变化
    const handleEditorChange = ({ text }: { text: string }) => {
        setEditorContent(text);
    };

    const onFinish = async (values: Partial<GrammarAnalysis>) => {
        // 验证富文本编辑器内容
        if (!editorContent.trim()) {
            message.error('请输入内容');
            return;
        }
        
        setSubmitting(true);
        try {
            const submitData = {
                ...values,
                originContent: editorContent
            };
            
            if (isEdit) {
                await updateGrammarAnalysis(Number(id), submitData);
                message.success('语法分析更新成功');
            } else {
                await createGrammarAnalysis(submitData);
                message.success('语法分析创建成功');
            }
            navigate('/content/grammar-analysis');
        } catch (error) {
            message.error('保存语法分析失败');
        }
        setSubmitting(false);
    };

    // 返回列表页
    const handleBack = () => {
        navigate('/content/grammar-analysis');
    };

    return (
        <div 
            ref={pageContainerRef}
            style={{
                maxWidth: '100%',
                margin: '0 auto',
                padding: '0 8px',
                boxSizing: 'border-box',
                width: '100%'
            }}
        >
            <Card
                title={isEdit ? '编辑语法分析' : '新建语法分析'}
            >
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            difficulty: 'easy'
                        }}
                    >
                        <Form.Item
                            name="title"
                            label="标题"
                            rules={[{ required: true, message: '请输入标题' }]}
                        >
                            <Input placeholder="请输入标题" />
                        </Form.Item>

                        <Form.Item
                            label="内容"
                            required
                            validateStatus={editorContent ? 'success' : undefined}
                            help={!editorContent ? '请输入内容' : undefined}
                        >
                            <MdEditor
                                style={{ 
                                    height: '300px', 
                                    border: '1px solid #d9d9d9', 
                                    borderRadius: 4,
                                    overflow: 'hidden'
                                }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={handleEditorChange}
                                value={editorContent}
                                placeholder="请在此输入内容..."
                            />
                        </Form.Item>

                        <Form.Item
                            name="difficulty"
                            label="难度级别"
                            rules={[{ required: true, message: '请选择难度级别' }]}
                        >
                            <Select placeholder="请选择难度级别">
                                <Option value="easy">简单</Option>
                                <Option value="medium">中等</Option>
                                <Option value="hard">困难</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
                            <Space>
                                <Button onClick={handleBack}>取消</Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitting}
                                >
                                    {isEdit ? '更新' : '确定'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default GrammarAnalysisFormPage;