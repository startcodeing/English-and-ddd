import React, { useMemo } from 'react';
import { Alert, Button, Space, Popconfirm, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  BatchOperationConfig,
  BatchAction,
} from '../types';
import './style.css';

const { Text } = Typography;

export interface BatchOperationAreaProps {
  config: BatchOperationConfig;
  selectedRows: any[];
}

/**
 * 批量操作区域组件
 * 显示选中项数量和提供批量操作按钮
 */
export function BatchOperationArea(props: BatchOperationAreaProps) {
  const { config, selectedRows } = props;
  const {
    batchActions = [],
    selectedRowKeys = [],
    onSelectionChange,
  } = config;

  // 计算选中数量
  const selectedCount = selectedRowKeys.length;

  // 处理清空选择
  const handleClearSelection = () => {
    onSelectionChange?.([], []);
  };

  // 处理批量操作
  const handleBatchAction = (action: BatchAction) => {
    if (action.disabled) return;
    action.onClick(selectedRowKeys, selectedRows);
  };

  // 渲染批量操作按钮
  const renderBatchActions = () => {
    if (!batchActions.length) return null;

    return (
      <Space className="batch-operation-area__actions">
        {batchActions.map((action) => {
          const isDisabled = typeof action.disabled === 'function' 
            ? selectedRows.some(row => (action.disabled as (row: any) => boolean)(row))
            : Boolean(action.disabled);

          const buttonElement = (
            <Button
              key={action.key}
              type={action.danger ? 'primary' : 'default'}
              danger={action.danger}
              disabled={isDisabled || selectedCount === 0}
              icon={action.icon}
              size="small"
              onClick={() => handleBatchAction(action)}
            >
              {action.label}
            </Button>
          );

          // 如果是危险操作，添加确认弹窗
          if (action.danger) {
            return (
              <Popconfirm
                key={action.key}
                title={`确定要${action.label}选中的 ${selectedCount} 项吗？`}
                description="此操作不可撤销，请谨慎操作。"
                icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                onConfirm={() => handleBatchAction(action)}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                {buttonElement}
              </Popconfirm>
            );
          }

          return buttonElement;
        })}
      </Space>
    );
  };

  // 计算提示信息类型
  const alertType = useMemo(() => {
    if (selectedCount === 0) return 'info';
    if (selectedCount < 10) return 'success';
    if (selectedCount < 50) return 'warning';
    return 'error';
  }, [selectedCount]);

  // 计算提示信息图标
  const alertIcon = useMemo(() => {
    switch (alertType) {
      case 'success':
        return <CheckCircleOutlined />;
      case 'warning':
      case 'error':
        return <ExclamationCircleOutlined />;
      default:
        return undefined;
    }
  }, [alertType]);

  // 计算提示信息文本
  const alertMessage = useMemo(() => {
    if (selectedCount === 0) {
      return '请选择要操作的项目';
    }
    
    let message = `已选中 ${selectedCount} 项`;
    
    if (selectedCount >= 50) {
      message += '，建议分批处理以提高性能';
    } else if (selectedCount >= 10) {
      message += '，请确认操作无误';
    }
    
    return message;
  }, [selectedCount]);

  if (!config.showBatchActions) {
    return null;
  }

  return (
    <div className="batch-operation-area">
      <Alert
        type={alertType}
        icon={alertIcon}
        message={
          <div className="batch-operation-area__content">
            <div className="batch-operation-area__info">
              <Text strong>{alertMessage}</Text>
              {selectedCount > 0 && (
                <Button
                  type="link"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={handleClearSelection}
                  className="batch-operation-area__clear"
                >
                  清空选择
                </Button>
              )}
            </div>
            
            {/* 批量操作按钮 */}
            {renderBatchActions()}
          </div>
        }
        showIcon
        className="batch-operation-area__alert"
      />
    </div>
  );
}

export default BatchOperationArea;