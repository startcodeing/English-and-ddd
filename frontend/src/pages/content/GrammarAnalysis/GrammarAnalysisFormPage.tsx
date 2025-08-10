import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getGrammarAnalysis, createGrammarAnalysis, updateGrammarAnalysis } from '@/api/grammarAnalysis';
import { GrammarAnalysis } from '@/types/grammar-analysis';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

const GrammarAnalysisFormPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            getGrammarAnalysis(Number(id)).then(res => {
                if (res.data.success) {
                    form.setFieldsValue(res.data.data);
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [id, isEdit, form]);

    const onFinish = async (values: Partial<GrammarAnalysis>) => {
        setLoading(true);
        try {
            if (isEdit) {
                await updateGrammarAnalysis(Number(id), values);
                message.success('Grammar analysis updated successfully');
            } else {
                await createGrammarAnalysis(values);
                message.success('Grammar analysis created successfully');
            }
            navigate('/content/grammar-analysis');
        } catch (error) {
            message.error('Failed to save grammar analysis');
        }
        setLoading(false);
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ difficulty: 'easy' }}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="originContent" label="Content" rules={[{ required: true }]}>
                 <ReactQuill theme="snow" />
            </Form.Item>
            <Form.Item name="difficulty" label="Difficulty" rules={[{ required: true }]}>
                <Select>
                    <Option value="easy">Easy</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="hard">Hard</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {isEdit ? 'Update' : 'Create'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default GrammarAnalysisFormPage;