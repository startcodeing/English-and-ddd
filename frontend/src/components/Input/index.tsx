import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import './style.css';

export interface InputProps extends AntInputProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 输入框标签
   */
  label?: string;
  /**
   * 是否显示错误状态
   */
  error?: boolean;
  /**
   * 错误信息
   */
  errorMessage?: string;
}

/**
 * 输入框组件
 * 基于Ant Design的Input组件封装，添加了标签和错误状态
 */
const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  errorMessage,
  ...props
}) => {
  return (
    <div className="custom-input-container">
      {label && <div className="custom-input-label">{label}</div>}
      <AntInput
        className={`custom-input ${error ? 'custom-input-error' : ''} ${className || ''}`}
        {...props}
      />
      {error && errorMessage && (
        <div className="custom-input-error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Input;