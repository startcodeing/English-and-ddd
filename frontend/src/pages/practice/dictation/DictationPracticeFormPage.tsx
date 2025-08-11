import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Form, Input, Select, Space, Typography, message, Spin, Slider, Divider } from 'antd';
import { SaveOutlined, SendOutlined, ArrowLeftOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { createDictationPractice, updateDictationPractice, getDictationPracticeById, submitDictationPractice } from '../../../api/dictationPractice';
import { getAllListeningMaterials, getListeningMaterialById } from '../../../api/listeningMaterial';

const { Title } = Typography;
const { TextArea } = Input;

interface ListeningMaterial {
  id: string;
  title: string;
  difficulty: string;
  transcript: string;
  audioUrl?: string;
}

const DictationPracticeFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const isEdit = !!id;
  
  // 状态管理
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [materials, setMaterials] = useState<ListeningMaterial[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<ListeningMaterial | null>(null);
  
  // 音频播放相关状态
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 获取听力资料列表
  const fetchMaterials = async () => {
    setMaterialsLoading(true);
    try {
      const response = await getAllListeningMaterials();
      if (response.success && response.data) {
        // 确保response.data是数组
        const materialsData = Array.isArray(response.data) ? response.data : [];
        setMaterials(materialsData);
      } else {
        message.error('获取听力资料列表失败');
        setMaterials([]); // 设置为空数组
      }
    } catch (error) {
      console.error('获取听力资料列表出错:', error);
      message.error('获取听力资料列表失败');
      setMaterials([]); // 设置为空数组
    } finally {
      setMaterialsLoading(false);
    }
  };

  // 获取听写练习详情（编辑模式）
  const fetchPracticeDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getDictationPracticeById(Number(id));
      if (response.success && response.data) {
        const practice = response.data;
        form.setFieldsValue({
          listenMaterialId: practice.listenMaterialId,
          content: practice.content,
        });
        
        // 设置选中的听力资料
        const material = materials.find(m => m.id === practice.listenMaterialId.toString());
        if (material) {
          setSelectedMaterial(material);
        }
      } else {
        message.error(response.message || '获取听写练习详情失败');
        navigate('..');
      }
    } catch (error) {
      console.error('获取听写练习详情出错:', error);
      message.error('获取听写练习详情失败');
      navigate('..');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchMaterials();
  }, []);

  // 听力资料加载完成后，如果是编辑模式则获取练习详情
  useEffect(() => {
    if (materials.length > 0 && isEdit) {
      fetchPracticeDetail();
    }
  }, [materials, isEdit, id]);

  // 处理听力资料选择
  const handleMaterialChange = async (materialId: string | number) => {
    try {
      const response = await getListeningMaterialById(materialId.toString());
      if (response.success && response.data) {
        setSelectedMaterial(response.data);
      }
    } catch (error) {
      console.error('获取听力资料详情出错:', error);
      message.error('获取听力资料详情失败');
    }
  };
  
  // 播放/暂停音频
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // 更新进度条
  const updateProgress = () => {
    if (!audioRef.current) return;
    
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // 拖动进度条
  const handleProgressChange = (value: number) => {
    if (!audioRef.current) return;
    
    const newTime = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 保存草稿
  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const practiceData = {
        ...values,
        status: 'draft',
      };
      
      let response;
      if (isEdit) {
        response = await updateDictationPractice(Number(id), practiceData);
      } else {
        response = await createDictationPractice(practiceData);
      }
      
      if (response.success) {
        message.success(isEdit ? '更新成功' : '创建成功');
        navigate('/practice/dictation');
      } else {
        message.error(response.message || (isEdit ? '更新失败' : '创建失败'));
      }
    } catch (error) {
      console.error('保存听写练习出错:', error);
      message.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交练习
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // 验证必填字段
      if (!values.listenMaterialId || !values.content || values.content.trim() === '') {
        message.error('请填写所有必填字段');
        return;
      }
      
      let practiceId = id;
      
      // 如果是新建，先保存
      if (!isEdit) {
        const practiceData = {
          ...values,
          status: 'draft',
          listenMaterialId: Number(values.listenMaterialId) // 确保listenMaterialId是数字
        };
        
        try {
          const createResponse = await createDictationPractice(practiceData);
          if (!createResponse.success) {
            message.error(createResponse.message || '创建失败');
            return;
          }
          practiceId = createResponse.data?.id?.toString();
        } catch (createError: any) {
          console.error('创建听写练习失败:', createError);
          message.error(createError.message || '创建失败，请稍后重试');
          return;
        }
      } else {
        // 如果是编辑，先更新
        const practiceData = {
          ...values,
          status: 'draft',
          listenMaterialId: Number(values.listenMaterialId) // 确保listenMaterialId是数字
        };
        
        try {
          const updateResponse = await updateDictationPractice(Number(id), practiceData);
          if (!updateResponse.success) {
            message.error(updateResponse.message || '更新失败');
            return;
          }
        } catch (updateError: any) {
          console.error('更新听写练习失败:', updateError);
          message.error(updateError.message || '更新失败，请稍后重试');
          return;
        }
      }
      
      // 提交练习
      if (practiceId) {
        try {
          const submitResponse = await submitDictationPractice(Number(practiceId));
          if (submitResponse.success) {
            message.success('提交成功');
            navigate('/practice/dictation');
          } else {
            message.error(submitResponse.message || '提交失败');
          }
        } catch (submitError: any) {
          console.error('提交听写练习失败:', submitError);
          message.error(submitError.message || '提交失败，请稍后重试');
        }
      } else {
        message.error('提交失败：无法获取练习ID');
      }
    } catch (error: any) {
      console.error('提交听写练习出错:', error);
      message.error(error.message || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 表单验证失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('表单验证失败:', errorInfo);
    message.error('请检查表单输入');
    
    // 检查具体的错误字段并给出更明确的提示
    const errors = errorInfo.errorFields || [];
    errors.forEach((error: any) => {
      const fieldName = error.name[0];
      if (fieldName === 'listenMaterialId') {
        message.error('请选择听力资料');
      } else if (fieldName === 'content') {
        message.error('请输入听写内容');
      }
    });
  };

  return (
    <div style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? '编辑听写练习' : '新建听写练习'}
          </Title>
        </div>

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            onFinishFailed={onFinishFailed}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
              <Form.Item
                name="listenMaterialId"
                label="选择听力资料"
                rules={[{ required: true, message: '请选择听力资料' }]}
              >
                <Select
                  placeholder="请选择听力资料"
                  loading={materialsLoading}
                  showSearch
                  optionFilterProp="label"
                  onChange={handleMaterialChange}
                  options={(materials || []).map(material => ({
                    value: material.id,
                    label: `${material.title} (${material.difficulty})`,
                  }))}
                />
              </Form.Item>

              {selectedMaterial && (
                <Card 
                  title="听力资料信息" 
                  size="small" 
                  style={{ marginBottom: '16px', backgroundColor: '#f9f9f9' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: '0 0 8px 0' }}><strong>标题：</strong>{selectedMaterial.title}</p>
                      <p style={{ margin: '0' }}><strong>难度：</strong>{selectedMaterial.difficulty}</p>
                    </div>
                    
                    {selectedMaterial.audioUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
                        <Button 
                          type="link" 
                          icon={isPlaying ? <PauseCircleOutlined style={{ fontSize: '28px' }} /> : <PlayCircleOutlined style={{ fontSize: '28px' }} />} 
                          onClick={togglePlay}
                          style={{ padding: 0, height: 'auto' }}
                        />
                        <audio 
                          ref={audioRef} 
                          src={selectedMaterial.audioUrl} 
                          onTimeUpdate={updateProgress}
                          onLoadedMetadata={updateProgress}
                          onEnded={() => setIsPlaying(false)}
                          style={{ display: 'none' }}
                        />
                        <div style={{ marginLeft: '8px', flexGrow: 1, maxWidth: '150px' }}>
                          <Slider 
                            value={duration ? (currentTime / duration) * 100 : 0} 
                            tooltip={{ formatter: null }}
                            onChange={handleProgressChange}
                            style={{ marginBottom: '4px' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <Form.Item
                name="content"
                label="听写内容"
                rules={[{ required: true, message: '请输入听写内容' }]}
                extra="请根据听力资料进行听写练习"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <TextArea
                  style={{ minHeight: '300px' }}
                  placeholder="请在此输入您的听写内容..."
                  showCount
                  maxLength={5000}
                />
              </Form.Item>
            </div>

            <Form.Item style={{ marginTop: '16px', marginBottom: '0', display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button onClick={() => navigate('/practice/dictation')}>
                  取消
                </Button>
                <Button 
                  type="default" 
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  loading={loading}
                >
                  保存草稿
                </Button>
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  loading={submitting}
                  onClick={() => {
                    // 先禁用按钮，防止重复点击
                    if (submitting) return;
                    
                    form.validateFields().then(values => {
                      // 确保content字段不为空
                      if (!values.content || values.content.trim() === '') {
                        message.error('请输入听写内容');
                        return;
                      }
                      // 确保选择了听力资料
                      if (!values.listenMaterialId) {
                        message.error('请选择听力资料');
                        return;
                      }
                      
                      // 确保listenMaterialId是有效的数字
                      const materialId = Number(values.listenMaterialId);
                      if (isNaN(materialId) || materialId <= 0) {
                        message.error('无效的听力资料ID');
                        return;
                      }
                      
                      handleSubmit(values);
                    }).catch(info => {
                      console.log('验证失败:', info);
                      onFinishFailed(info);
                    });
                  }}
                >
                  提交练习
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default DictationPracticeFormPage;