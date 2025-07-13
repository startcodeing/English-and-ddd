import React from 'react';
import {
  BookOutlined,
  EditOutlined,
  FileTextOutlined,
  DeleteOutlined,
  PlusOutlined,
  FormOutlined,
  ReadOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

interface UserActivityIconProps {
  activityType: string;
  module: string;
  className?: string;
}

/**
 * 用户活动图标组件
 * 根据活动类型和模块显示不同的图标
 */
const UserActivityIcon: React.FC<UserActivityIconProps> = ({ activityType, module, className }) => {
  // 根据活动类型和模块选择合适的图标
  const getIcon = () => {
    // 根据模块选择基础图标
    switch (module) {
      case 'VOCABULARY':
        return <BookOutlined className={className} />;
      case 'CONTENT':
        if (activityType.includes('SENTENCE')) {
          return <FormOutlined className={className} />;
        } else if (activityType.includes('ARTICLE')) {
          return <FileTextOutlined className={className} />;
        }
        return <ReadOutlined className={className} />;
      case 'PRACTICE':
        return <EditOutlined className={className} />;
      case 'TEST':
        return <FormOutlined className={className} />;
      default:
        return <HistoryOutlined className={className} />;
    }
  };

  // 根据活动类型进一步细化图标
  const getIconByActivityType = () => {
    if (activityType.includes('CREATED')) {
      return <PlusOutlined className={className} />;
    } else if (activityType.includes('UPDATED')) {
      return <EditOutlined className={className} />;
    } else if (activityType.includes('DELETED')) {
      return <DeleteOutlined className={className} />;
    }
    
    // 如果没有特定的活动类型匹配，使用基于模块的图标
    return getIcon();
  };

  return getIconByActivityType();
};

export default UserActivityIcon;