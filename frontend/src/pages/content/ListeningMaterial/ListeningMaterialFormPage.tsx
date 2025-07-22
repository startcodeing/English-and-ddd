import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Upload, message, Card, Typography, Space } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { getListeningMaterialById, createListeningMaterial, updateListeningMaterial } from '../../../api/listeningMaterial';
import { ListeningMaterialDifficultyLevel } from '../../../types/listeningMaterial';
import type { CreateListeningMaterialRequest, UpdateListeningMaterialRequest, ListeningMaterial } from '../../../types/listeningMaterial';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ListeningMaterialFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<RcFile | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');

  // 加载听力资料详情（编辑模式）
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchListeningMaterial(id);
    }
  }, [id]);

  // 获取听力资料详情
  const fetchListeningMaterial = async (id: string) => {
    try {
      setLoading(true);
      const response = await getListeningMaterialById(id);
      const data = response.data;
      
      form.setFieldsValue({
        title: data.title,
        transcript: data.originContent, // 后端返回的是originContent字段
        difficulty: data.difficulty,
      });
      
      setCurrentAudioUrl(data.audioUrl);
    } catch (error) {
      message.error('获取听力资料失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        // 编辑模式
        if (!id) return;
        
        const updateData: UpdateListeningMaterialRequest = {
          title: values.title,
          transcript: values.transcript,
          difficulty: values.difficulty,
        };
        
        await updateListeningMaterial(id, updateData, audioFile || undefined);
        message.success('更新成功');
      } else {
        // 创建模式
        if (!audioFile) {
          message.error('请上传音频文件');
          setLoading(false);
          return;
        }
        
        // 构建创建请求数据
        const createData: CreateListeningMaterialRequest = {
          title: values.title,
          transcript: values.transcript,
          difficulty: values.difficulty,
          audioFile: audioFile, // 这里添加audioFile，但实际API调用时会单独传递
        };
        
        await createListeningMaterial(createData, audioFile);
        message.success('创建成功');
      }
      
      // 返回列表页
      navigate('/content/listening-materials/page');
    } catch (error) {
      message.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  // 音频文件上传前的校验
  const beforeUpload = (file: RcFile) => {
    const isAudio = file.type.startsWith('audio/');
    if (!isAudio) {
      message.error('只能上传音频文件！');
      return false;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('音频文件大小不能超过10MB！');
      return false;
    }
    
    setAudioFile(file);
    return false; // 阻止自动上传
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/content/listening-materials/page')}
            >
              返回
            </Button>
            <Title level={4}>{isEdit ? '编辑' : '创建'}听力资料</Title>
          </Space>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            difficulty: ListeningMaterialDifficultyLevel.EASY,
          }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入听力资料标题" />
          </Form.Item>
          
          <Form.Item
            name="transcript"
            label="原文"
            rules={[{ required: true, message: '请输入原文' }]}
          >
            <TextArea rows={10} placeholder="请输入听力资料原文" />
          </Form.Item>
          
          <Form.Item
            name="difficulty"
            label="难度级别"
            rules={[{ required: true, message: '请选择难度级别' }]}
          >
            <Select placeholder="请选择难度级别">
              <Option value={ListeningMaterialDifficultyLevel.EASY}>初级</Option>
              <Option value={ListeningMaterialDifficultyLevel.MEDIUM}>中级</Option>
              <Option value={ListeningMaterialDifficultyLevel.HARD}>高级</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="音频文件"
            required={!isEdit}
            help={isEdit ? '如不上传新文件，将保留原音频文件' : '请上传音频文件（MP3、WAV等格式，大小不超过10MB）'}
          >
            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              showUploadList={true}
              fileList={audioFile ? [{
                uid: '-1',
                name: audioFile.name,
                status: 'done',
                url: URL.createObjectURL(audioFile),
              }] : []}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            {isEdit && currentAudioUrl && !audioFile && (
              <div style={{ marginTop: '8px' }}>
                <audio controls src={currentAudioUrl} style={{ marginTop: '8px' }} />
                <div>当前音频文件</div>
              </div>
            )}
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ListeningMaterialFormPage;