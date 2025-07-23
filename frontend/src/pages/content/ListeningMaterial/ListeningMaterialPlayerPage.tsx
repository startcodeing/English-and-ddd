import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Skeleton, Space, Divider, Slider, message } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { getListeningMaterialById } from '../../../api/listeningMaterial';
import type { ListeningMaterial } from '../../../types/listeningMaterial';

const { Title, Paragraph } = Typography;

const ListeningMaterialPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [material, setMaterial] = useState<ListeningMaterial | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 获取听力资料详情
  useEffect(() => {
    if (id) {
      fetchListeningMaterial(id);
    }
  }, [id]);

  // 获取听力资料详情
  const fetchListeningMaterial = async (id: string) => {
    try {
      setLoading(true);
      const response = await getListeningMaterialById(id);
      setMaterial(response.data);
    } catch (error) {
      message.error('获取听力资料失败');
    } finally {
      setLoading(false);
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

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : material ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Space>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate(`/content/listening-materials/detail/${id}`)}
                >
                  返回
                </Button>
                <Title level={4}>{material.title}</Title>
              </Space>
            </div>
            
            <Divider orientation="left">音频播放</Divider>
            
            {material.audioUrl ? (
              <div style={{ marginBottom: '20px' }}>
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
              </div>
            ) : (
              <Paragraph>无音频文件</Paragraph>
            )}
            
            <Divider orientation="left">原文</Divider>
            
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              backgroundColor: '#f5f5f5', 
              padding: '16px', 
              borderRadius: '4px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {material.originContent}
            </div>
          </>
        ) : (
          <div>未找到听力资料</div>
        )}
      </Card>
    </div>
  );
};

export default ListeningMaterialPlayerPage;