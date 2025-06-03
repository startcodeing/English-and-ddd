import React from 'react';
import { Spin, SpinProps } from 'antd';
import './style.css';

export interface LoadingProps extends SpinProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 是否全屏显示
   */
  fullScreen?: boolean;
  /**
   * 加载文本
   */
  text?: string;
}

/**
 * 加载组件
 * 基于Ant Design的Spin组件封装，支持全屏加载
 */
const Loading: React.FC<LoadingProps> = ({
  className,
  fullScreen = false,
  text,
  ...props
}) => {
  if (fullScreen) {
    return (
      <div className="custom-loading-fullscreen">
        <Spin
          className={`custom-loading ${className || ''}`}
          tip={text}
          size="large"
          {...props}
        />
      </div>
    );
  }

  return (
    <Spin
      className={`custom-loading ${className || ''}`}
      tip={text}
      {...props}
    />
  );
};

export default Loading;