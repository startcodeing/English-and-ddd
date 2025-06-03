import React from 'react';
import { Modal as AntModal, ModalProps as AntModalProps } from 'antd';
import './style.css';

export interface ModalProps extends AntModalProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 对话框内容
   */
  children?: React.ReactNode;
  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;
}

/**
 * 对话框组件
 * 基于Ant Design的Modal组件封装，添加了自定义样式
 */
const Modal: React.FC<ModalProps> = ({
  className,
  children,
  showCloseButton = true,
  ...props
}) => {
  return (
    <AntModal
      className={`custom-modal ${className || ''}`}
      closable={showCloseButton}
      {...props}
    >
      {children}
    </AntModal>
  );
};

export default Modal;