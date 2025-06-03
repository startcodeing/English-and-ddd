import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import './style.css';

export interface ButtonProps extends AntButtonProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 按钮文本
   */
  children?: React.ReactNode;
}

/**
 * 按钮组件
 * 基于Ant Design的Button组件封装，添加了自定义样式
 */
const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <AntButton className={`custom-button ${className || ''}`} {...props}>
      {children}
    </AntButton>
  );
};

export default Button;