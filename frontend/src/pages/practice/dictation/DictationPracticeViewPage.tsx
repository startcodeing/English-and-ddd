import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Form, InputNumber, Row, Space, Tag, Typography, message, Spin, Divider, Slider } from 'antd';
import { ArrowLeftOutlined, EditOutlined, StarOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getDictationPracticeById, scoreDictationPractice } from '../../../api/dictationPractice';
import { getListeningMaterialById } from '../../../api/listeningMaterial';

const { Title, Text, Paragraph } = Typography;

interface DictationPractice {
  id: number;
  listenMaterialId: number;
  status: string;
  content: string;
  score?: number;
  userId: number;
  username: string;
  createTime: string;
  updateTime: string;
}

interface ListeningMaterial {
  id: number;
  title: string;
  difficulty: string;
  transcript: string;
  audioUrl?: string;
}

const DictationPracticeViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  
  // 状态管理
  const [loading, setLoading] = useState<boolean>(false);
  const [scoring, setScoring] = useState<boolean>(false);
  const [practice, setPractice] = useState<DictationPractice | null>(null);
  const [material, setMaterial] = useState<ListeningMaterial | null>(null);
  const [showScoreForm, setShowScoreForm] = useState<boolean>(false);
  
  // 音频播放相关状态
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 获取听写练习详情
  const fetchPracticeDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getDictationPracticeById(Number(id));
      if (response.success && response.data) {
        const practiceData = response.data;
        setPractice(practiceData);
        
        // 获取对应的听力资料
        fetchMaterialDetail(practiceData.listenMaterialId);
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

  // 获取听力资料详情
  const fetchMaterialDetail = async (materialId: number) => {
    try {
      const response = await getListeningMaterialById(materialId.toString());
      if (response.success && response.data) {
        setMaterial(response.data);
      }
    } catch (error) {
      console.error('获取听力资料详情出错:', error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchPracticeDetail();
  }, [id]);

  // 处理评分
  const handleScore = async (values: { score: number }) => {
    if (!practice) return;
    
    setScoring(true);
    try {
      const response = await scoreDictationPractice(practice.id, values.score);
      if (response.success) {
        message.success('评分成功');
        setShowScoreForm(false);
        // 重新获取练习详情
        fetchPracticeDetail();
      } else {
        message.error(response.message || '评分失败');
      }
    } catch (error) {
      console.error('评分听写练习出错:', error);
      message.error('评分失败');
    } finally {
      setScoring(false);
    }
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
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
  };

  // 渲染难度标签
  const renderDifficultyTag = (difficulty: string) => {
    let color = 'blue';
    let text = difficulty;
    
    if (difficulty === 'BEGINNER') {
      color = 'green';
      text = '初级';
    } else if (difficulty === 'INTERMEDIATE') {
      color = 'orange';
      text = '中级';
    } else if (difficulty === 'ADVANCED') {
      color = 'red';
      text = '高级';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }
  
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

  if (!practice) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>听写练习不存在</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
        <div style={{ marginBottom: '24px' }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/practice/dictation')}
            >
              返回列表
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              听写练习详情
            </Title>
          </Space>
        </div>

        <Row gutter={24}>
          <Col span={16}>
            {/* 练习信息 */}
            <Card title="练习信息" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>练习ID：</Text>
                  <Text>{practice.id}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>状态：</Text>
                  {renderStatusTag(practice.status)}
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: '12px' }}>
                <Col span={12}>
                  <Text strong>创建时间：</Text>
                  <Text>{dayjs(practice.createTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>更新时间：</Text>
                  <Text>{dayjs(practice.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: '12px' }}>
                <Col span={12}>
                  <Text strong>用户：</Text>
                  <Text>{practice.username}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>分数：</Text>
                  <Text>{practice.score ? `${practice.score} 分` : '未评分'}</Text>
                </Col>
              </Row>
            </Card>

            {/* 听力资料信息 */}
            {material && (
              <Card title="听力资料" style={{ marginBottom: '24px' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>标题：</Text>
                    <Text>{material.title}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>难度：</Text>
                    {renderDifficultyTag(material.difficulty)}
                  </Col>
                </Row>
                
                {material.audioUrl && (
                  <>
                    <Divider orientation="left">音频播放</Divider>
                    {/* 隐藏的音频元素，用于控制播放 */}
                    <audio 
                      ref={audioRef} 
                      src={material.audioUrl} 
                      onTimeUpdate={updateProgress}
                      onLoadedMetadata={updateProgress}
                      onEnded={() => setIsPlaying(false)}
                      style={{ display: 'none' }}
                    />
                    
                    {/* 自定义播放控件 */}
                    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                      <Button 
                        type="link" 
                        icon={isPlaying ? <PauseCircleOutlined style={{ fontSize: '32px' }} /> : <PlayCircleOutlined style={{ fontSize: '32px' }} />} 
                        onClick={togglePlay}
                        style={{ padding: 0, height: 'auto' }}
                      />
                      <div style={{ marginLeft: '8px', flexGrow: 1 }}>
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
                  </>
                )}
                
                <Divider orientation="left">原文</Divider>
                <div style={{ 
                  marginTop: '8px',
                  padding: '12px', 
                  backgroundColor: '#f9f9f9', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  <Paragraph>{material.transcript}</Paragraph>
                </div>
              </Card>
            )}

            {/* 听写内容 */}
            <Card title="听写内容" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fff', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                minHeight: '200px',
                flex: 1
              }}>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {practice.content}
                </Paragraph>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            {/* 操作面板 */}
            <Card title="操作">
              <Space direction="vertical" style={{ width: '100%' }}>
                {practice.status === 'draft' && (
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    block
                    onClick={() => navigate(`/practice/dictation/edit/${practice.id}`)}
                  >
                    编辑练习
                  </Button>
                )}
                
                {practice.status === 'submitted' && !practice.score && (
                  <Button 
                    type="primary" 
                    icon={<StarOutlined />}
                    block
                    onClick={() => setShowScoreForm(true)}
                  >
                    评分
                  </Button>
                )}
                
                {practice.score && (
                  <Button 
                    type="default" 
                    icon={<StarOutlined />}
                    block
                    onClick={() => setShowScoreForm(true)}
                  >
                    重新评分
                  </Button>
                )}
              </Space>
            </Card>

            {/* 评分表单 */}
            {showScoreForm && (
              <Card title="评分" style={{ marginTop: '16px' }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleScore}
                  initialValues={{ score: practice.score || 0 }}
                >
                  <Form.Item
                    name="score"
                    label="分数"
                    rules={[
                      { required: true, message: '请输入分数' },
                      { type: 'number', min: 0, max: 100, message: '分数范围为0-100' }
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      style={{ width: '100%' }}
                      placeholder="请输入分数（0-100）"
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Space>
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={scoring}
                      >
                        确认评分
                      </Button>
                      <Button onClick={() => setShowScoreForm(false)}>
                        取消
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DictationPracticeViewPage;