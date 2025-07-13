import React from 'react';
import { Modal, Typography, Descriptions, Button } from 'antd';
import { UserActivity } from '../api/userActivityApi';
import UserActivityIcon from './UserActivityIcon';
import UserActivityModuleColor from './UserActivityModuleColor';
import UserActivityTypeTag from './UserActivityTypeTag';

const { Title, Text } = Typography;

interface UserActivityDetailProps {
  activity: UserActivity | null;
  visible: boolean;
  onClose: () => void;
}

/**
 * 用户活动详情组件
 * 显示用户活动的详细信息
 */
const UserActivityDetail: React.FC<UserActivityDetailProps> = ({ activity, visible, onClose }) => {
  if (!activity) {
    return null;
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserActivityIcon activityType={activity.activityType} module={activity.module} />
          <UserActivityModuleColor module={activity.module}>
            <Title level={5} style={{ margin: 0 }}>{activity.title}</Title>
          </UserActivityModuleColor>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
      width={600}
    >
      <div style={{ marginBottom: '20px' }}>
        <UserActivityTypeTag activityType={activity.activityType} />
        <Text type="secondary" style={{ marginLeft: '10px' }}>{activity.formattedActivityTime}</Text>
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="活动描述">{activity.description}</Descriptions.Item>
        {activity.resourceId && (
          <Descriptions.Item label="相关资源ID">{activity.resourceId}</Descriptions.Item>
        )}
        {activity.resourceType && (
          <Descriptions.Item label="资源类型">{activity.resourceType}</Descriptions.Item>
        )}
        <Descriptions.Item label="用户">{activity.username}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UserActivityDetail;