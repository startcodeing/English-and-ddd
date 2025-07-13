import React from 'react';

interface UserActivityModuleColorProps {
  module: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * 用户活动模块颜色组件
 * 根据不同的模块为子元素应用不同的颜色样式
 */
const UserActivityModuleColor: React.FC<UserActivityModuleColorProps> = ({ module, children, className }) => {
  // 根据模块获取颜色
  const getColorByModule = (): string => {
    switch (module) {
      case 'VOCABULARY':
        return '#1890ff'; // 蓝色
      case 'CONTENT':
        return '#52c41a'; // 绿色
      case 'PRACTICE':
        return '#722ed1'; // 紫色
      case 'TEST':
        return '#fa8c16'; // 橙色
      default:
        return '#8c8c8c'; // 灰色
    }
  };

  const style = {
    color: getColorByModule(),
  };

  return <span style={style} className={className}>{children}</span>;
};

export default UserActivityModuleColor;