import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import './style.css';

export interface CardProps extends AntCardProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 卡片内容
   */
  children?: React.ReactNode;
  /**
   * 是否显示阴影
   */
  shadow?: boolean;
  /**
   * 是否可悬浮
   */
  hoverable?: boolean;
}

/**
 * 卡片组件
 * 基于Ant Design的Card组件封装，添加了自定义样式
 */
const Card: React.FC<CardProps> = ({
  className,
  children,
  shadow = false,
  hoverable = false,
  ...props
}) => {
  return (
    <AntCard
      className={`custom-card ${shadow ? 'custom-card-shadow' : ''} ${className || ''}`}
      hoverable={hoverable}
      {...props}
    >
      {children}
    </AntCard>
  );
};

export default Card;