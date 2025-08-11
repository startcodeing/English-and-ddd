import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Descriptions, Button, Tag, Divider, message, Popconfirm, Skeleton, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, AudioOutlined } from '@ant-design/icons';
import { getListeningMaterialById, deleteListeningMaterial } from '../../../api/listeningMaterial';
import type { ListeningMaterial } from '../../../types/listeningMaterial';
import { ListeningMaterialDifficultyLevel } from '../../../types/listeningMaterial';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

const ListeningMaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [material, setMaterial] = useState<ListeningMaterial | null>(null);

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
      setMaterial(response.data.data || response.data);
    } catch (error) {
      message.error('获取听力资料失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除听力资料
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteListeningMaterial(id);
      message.success('删除成功');
      navigate('/content/listening-materials/page');
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 获取难度级别标签
  const getDifficultyTag = (level: ListeningMaterialDifficultyLevel) => {
    let color = 'green';
    let text = '初级';
    
    if (level === ListeningMaterialDifficultyLevel.MEDIUM) {
      color = 'orange';
      text = '中级';
    } else if (level === ListeningMaterialDifficultyLevel.HARD) {
      color = 'red';
      text = '高级';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  // 格式化音频时长
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 格式化文件大小
  const formatFileSize = (size: number) => {
    const kb = size / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="听力资料详情"
        extra={
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/content/listening-materials/page')}
          >
            返回
          </Button>
        }
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : material ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ marginBottom: 0, marginRight: '8px' }}>{material.title}</Title>
              {material.difficulty && getDifficultyTag(material.difficulty)}
            </div>
            
            <Divider orientation="left">基本信息</Divider>
            
            <Descriptions column={2}>
              <Descriptions.Item label="创建时间">
                {material.createdAt ? dayjs(material.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {material.updatedAt ? dayjs(material.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="音频时长">
                {material.duration ? formatDuration(material.duration) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="文件大小">
                {material.fileSize ? formatFileSize(material.fileSize) : '-'}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">音频播放</Divider>
            
            {material.audioUrl ? (
              <div style={{ marginBottom: '20px' }}>
                <audio controls style={{ width: '100%' }} src={material.audioUrl} />
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Button 
                      type="link" 
                      icon={<AudioOutlined />}
                      onClick={() => window.open(material.audioUrl)}
                    >
                      在新窗口中打开
                    </Button>
                    <Button 
                      type="primary" 
                      onClick={() => navigate(`/content/listening-materials/player/${id}`)}
                    >
                      播放模式
                    </Button>
                  </Space>
                  {material.originFileName && (
                    <span style={{ color: '#666' }}>原始文件名: {material.originFileName}</span>
                  )}
                </div>
              </div>
            ) : (
              <Paragraph>无音频文件</Paragraph>
            )}
            
            <Divider orientation="left">原文</Divider>
            
            <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
              {material.originContent}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={() => navigate(`/content/listening-materials/edit/${id}`)}
                >
                  编辑
                </Button>
                <Popconfirm
                  title="确定要删除这个听力资料吗？"
                  onConfirm={handleDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger icon={<DeleteOutlined />}>删除</Button>
                </Popconfirm>
              </Space>
            </div>
          </>
        ) : (
          <div>未找到听力资料</div>
        )}
      </Card>
    </div>
  );
};

export default ListeningMaterialDetailPage;