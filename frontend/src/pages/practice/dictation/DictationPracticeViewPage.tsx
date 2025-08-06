import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Form, InputNumber, Row, Space, Tag, Typography, message, Spin, Divider, Slider, Tabs } from 'antd';
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
  id: string;
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
  const fetchMaterialDetail = async (materialId: string | number) => {
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
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 返回按钮 */}
      <div style={{ marginBottom: '16px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/practice/dictation')}
          style={{ marginBottom: '8px' }}
        >
          返回列表
        </Button>
      </div>

      {/* 练习信息和听力资料 Tab */}
       <Card 
         style={{ marginBottom: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
         bodyStyle={{ padding: '0' }}
       >
         <Tabs
           defaultActiveKey="practice"
           items={[
             {
               key: 'practice',
               label: '练习信息',
               children: (
                 <div style={{ padding: '16px' }}>
                   <Row gutter={[16, 8]}>
                     <Col span={4}>
                       <div>
                         <Text type="secondary" style={{ fontSize: '12px' }}>练习ID:</Text>
                         <div style={{ fontSize: '14px', fontWeight: 500 }}>{practice.id}</div>
                       </div>
                     </Col>
                     <Col span={4}>
                       <div>
                         <Text type="secondary" style={{ fontSize: '12px' }}>状态:</Text>
                         <div style={{ marginTop: '2px' }}>{renderStatusTag(practice.status)}</div>
                       </div>
                     </Col>
                     <Col span={4}>
                       <div>
                         <Text type="secondary" style={{ fontSize: '12px' }}>用户:</Text>
                         <div style={{ fontSize: '14px', fontWeight: 500 }}>{practice.username}</div>
                       </div>
                     </Col>
                     <Col span={4}>
                       <div>
                         <Text type="secondary" style={{ fontSize: '12px' }}>分数:</Text>
                         <div style={{ fontSize: '14px', fontWeight: 500, color: practice.score ? '#52c41a' : '#999' }}>
                           {practice.score ? `${practice.score} 分` : '未评分'}
                         </div>
                       </div>
                     </Col>
                     <Col span={4}>
                       <div>
                         <Text type="secondary" style={{ fontSize: '12px' }}>创建时间:</Text>
                         <div style={{ fontSize: '12px' }}>{dayjs(practice.createTime).format('MM-DD HH:mm')}</div>
                       </div>
                     </Col>
                     <Col span={4}>
                       <div>
                         <Text type="secondary" style={{ fontSize: '12px' }}>更新时间:</Text>
                         <div style={{ fontSize: '12px' }}>{dayjs(practice.updateTime).format('MM-DD HH:mm')}</div>
                       </div>
                     </Col>
                   </Row>
                 </div>
               )
             },
             material ? {
               key: 'material',
               label: '听力资料',
               children: (
                 <div style={{ padding: '16px' }}>
                   <Row gutter={[16, 8]} style={{ marginBottom: '12px' }}>
                     <Col span={12}>
                       <div>
                         <Text type="secondary" style={{ fontSize: '12px' }}>标题:</Text>
                         <div style={{ fontSize: '14px', fontWeight: 500 }}>{material.title}</div>
                       </div>
                     </Col>
                     <Col span={12}>
                       <div>
                         <Text type="secondary" style={{ fontSize: '12px' }}>难度:</Text>
                         <div style={{ marginTop: '2px' }}>{renderDifficultyTag(material.difficulty)}</div>
                       </div>
                     </Col>
                   </Row>
                   
                   {material.audioUrl && (
                     <div>
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
                       <div style={{ 
                         padding: '12px', 
                         backgroundColor: '#fafafa', 
                         borderRadius: '6px',
                         border: '1px solid #f0f0f0'
                       }}>
                         <div style={{ display: 'flex', alignItems: 'center' }}>
                           <Button 
                             type="link" 
                             icon={isPlaying ? <PauseCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} /> : <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />} 
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
                       </div>
                     </div>
                   )}
                 </div>
               )
             } : null
           ].filter(Boolean)}
         />
       </Card>

      {/* 原文 */}
       {material && (
         <Card 
           title={
             <div style={{ borderLeft: '4px solid #52c41a', paddingLeft: '12px' }}>
               原文
             </div>
           }
           style={{ marginBottom: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flex: '0 0 auto' }}
           bodyStyle={{ padding: '16px' }}
         >
           <div style={{ 
             padding: '12px', 
             backgroundColor: '#f9f9f9', 
             border: '1px solid #e8e8e8', 
             borderRadius: '6px',
             lineHeight: '1.5',
             maxHeight: '200px',
             overflowY: 'auto'
           }}>
             <Paragraph style={{ margin: 0, fontSize: '14px' }}>
               {material.transcript}
             </Paragraph>
           </div>
         </Card>
       )}

      {/* 听写内容 */}
       <Card 
         title={
           <div style={{ borderLeft: '4px solid #fa8c16', paddingLeft: '12px' }}>
             听写内容
           </div>
         }
         style={{ marginBottom: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flex: 1 }}
         bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)' }}
         extra={
           <Space>
             {practice.status === 'draft' && (
               <Button 
                 type="primary" 
                 icon={<EditOutlined />}
                 size="small"
                 onClick={() => navigate(`/practice/dictation/edit/${practice.id}`)}
               >
                 编辑练习
               </Button>
             )}
             
             {practice.status === 'submitted' && !practice.score && (
               <Button 
                 type="primary" 
                 icon={<StarOutlined />}
                 size="small"
                 onClick={() => setShowScoreForm(true)}
               >
                 评分
               </Button>
             )}
             
             {practice.score && (
               <Button 
                 type="default" 
                 icon={<StarOutlined />}
                 size="small"
                 onClick={() => setShowScoreForm(true)}
               >
                 重新评分
               </Button>
             )}
           </Space>
         }
       >
         <div style={{ 
            padding: '12px', 
            backgroundColor: '#fff', 
            border: '1px solid #e8e8e8', 
            borderRadius: '6px',
            height: '100%',
            lineHeight: '1.5',
            overflowY: 'auto',
            minHeight: '300px'
          }}>
           <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '14px' }}>
             {practice.content}
           </Paragraph>
         </div>
       </Card>

      {/* 评分表单 */}
      {showScoreForm && (
        <Card 
          title="评分" 
          style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Form
            form={form}
            layout="inline"
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
                style={{ width: '120px' }}
                placeholder="0-100"
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
    </div>
  );
};

export default DictationPracticeViewPage;