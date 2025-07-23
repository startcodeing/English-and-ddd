import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Upload, message, Card, Typography, Space } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { getListeningMaterialById, createListeningMaterial, updateListeningMaterial } from '../../../api/listeningMaterial';
import { ListeningMaterialDifficultyLevel } from '../../../types/listeningMaterial';
import type { CreateListeningMaterialRequest, UpdateListeningMaterialRequest, ListeningMaterial } from '../../../types/listeningMaterial';

const { Title } = Typography;
const { Option } = Select;

// 初始化markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

const ListeningMaterialFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<RcFile | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [transcriptValue, setTranscriptValue] = useState<string>('');

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
      
      const transcriptContent = data.originContent || '';
      
      form.setFieldsValue({
        title: data.title,
        transcript: transcriptContent, // 后端返回的是originContent字段
        difficulty: data.difficulty,
      });
      
      setTranscriptValue(transcriptContent);
      setCurrentAudioUrl(data.audioUrl);
      setCurrentFileName(data.originFileName || '');
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
        
        // 如果当前有音频文件URL但没有新上传的文件，保留原文件
        // 如果当前没有音频文件URL（用户点击了删除），且没有新上传的文件，则清空音频文件
        // 如果有新上传的文件，则使用新文件
        if (isEdit && !currentAudioUrl && !audioFile) {
          // 用户删除了音频文件且没有上传新文件，需要将audioPath设为null
          updateData.clearAudio = true;
        }
        
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
    <div style={{ padding: '16px', position: 'relative' }}>
      <Card bodyStyle={{ padding: '16px' }}>
        <div style={{ marginBottom: '12px' }}>
          <Title level={4} style={{ marginBottom: '0' }}>{isEdit ? '编辑' : '创建'}听力资料</Title>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            difficulty: ListeningMaterialDifficultyLevel.EASY,
          }}
          style={{ marginBottom: 0 }}
          labelCol={{ style: { marginBottom: '4px' } }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
            style={{ marginBottom: '12px' }}
          >
            <Input placeholder="请输入听力资料标题" />            
          </Form.Item>
          
          <Form.Item
            name="transcript"
            label="原文"
            rules={[{ required: true, message: '请输入原文' }]}
            style={{ marginBottom: '12px' }}
          >
            <MdEditor
              style={{ height: '280px' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={({ text }) => {
                setTranscriptValue(text);
                form.setFieldsValue({ transcript: text });
              }}
              value={transcriptValue}
              placeholder="请输入听力资料原文"
            />
          </Form.Item>
          
          <Form.Item
            name="difficulty"
            label="难度级别"
            rules={[{ required: true, message: '请选择难度级别' }]}
            style={{ marginBottom: '12px' }}
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
            style={{ marginBottom: '8px' }}
          >
            {/* 显示已上传的新文件 */}
            {audioFile && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>已选择新文件:</div>
                <Upload
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  showUploadList={true}
                  fileList={[{
                    uid: '-1',
                    name: audioFile.name,
                    status: 'done',
                    url: URL.createObjectURL(audioFile),
                  }]}
                >
                  <Button icon={<UploadOutlined />}>更换文件</Button>
                </Upload>
              </div>
            )}
            
            {/* 显示当前音频文件（编辑模式且没有新上传的文件） */}
            {isEdit && currentAudioUrl && !audioFile && (
              <div style={{ marginTop: '8px', border: '1px solid #f0f0f0', padding: '12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>当前音频文件: {currentFileName || '未知文件名'}</div>
                  <Button 
                    danger 
                    icon={<CloseOutlined />} 
                    onClick={() => {
                      setCurrentAudioUrl('');
                      setCurrentFileName('');
                    }}
                  >
                    删除
                  </Button>
                </div>
                <audio controls src={currentAudioUrl} style={{ width: '100%' }} />
                <div style={{ marginTop: '12px' }}>
                  <Upload
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    showUploadList={false}
                    fileList={[]}
                  >
                    <Button icon={<UploadOutlined />}>更换文件</Button>
                  </Upload>
                </div>
              </div>
            )}
            
            {/* 没有音频文件时显示上传按钮 */}
            {(!audioFile && (!isEdit || !currentAudioUrl)) && (
              <div style={{ border: '1px solid #f0f0f0', padding: '12px', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>请上传音频文件:</div>
                <Upload
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  showUploadList={false}
                  fileList={[]}
                >
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </div>
            )}
          </Form.Item>
          
        </Form>
        
        {/* 底部按钮组 */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          <Button 
            icon={<CloseOutlined />}
            onClick={() => navigate('/content/listening-materials/page')}
          >
            取消
          </Button>
          <Button 
            type="primary" 
            loading={loading}
            onClick={() => form.submit()}
          >
            {isEdit ? '更新' : '创建'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ListeningMaterialFormPage;