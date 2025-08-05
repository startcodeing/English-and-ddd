import React from 'react';
import { Breadcrumb, Button, Space, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import {
  BaseListPageConfig,
  HeaderActionConfig,
  BreadcrumbItem,
  ListPageHeaderProps,
} from '../types';
import './style.css';

const { Title } = Typography;

/**
 * 列表页面头部组件
 * 包含页面标题、描述、面包屑导航和操作按钮
 */
const ListPageHeader: React.FC<ListPageHeaderProps> = ({
  config,
  actionConfig,
  extra
}) => {
  const {
    title,
    description,
    showBreadcrumb = true,
    breadcrumbItems = [],
  } = config;

  // 渲染面包屑
  const renderBreadcrumb = () => {
    if (!showBreadcrumb) return null;

    const defaultBreadcrumbItems: BreadcrumbItem[] = [
      {
        title: '首页',
        href: '/',
        icon: <HomeOutlined />,
      },
      ...breadcrumbItems,
      {
        title,
      },
    ];

    return (
      <Breadcrumb className="list-page-header__breadcrumb">
        {defaultBreadcrumbItems.map((item, index) => (
          <Breadcrumb.Item key={index} href={item.href}>
            {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
            {item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  // 渲染操作按钮
  const renderActions = () => {
    if (!actionConfig) return null;

    const { actions = [], primaryAction } = actionConfig;

    return (
      <Space className="list-page-header__actions">
        {/* 次要操作按钮 */}
        {actions.map((action) => (
          <Button
            key={action.key}
            type={action.type || 'default'}
            danger={action.danger}
            disabled={action.disabled}
            icon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
        
        {/* 主要操作按钮 */}
        {primaryAction && (
          <Button
            type={primaryAction.type || 'primary'}
            danger={primaryAction.danger}
            disabled={primaryAction.disabled}
            icon={primaryAction.icon}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </Button>
        )}
      </Space>
    );
  };

  return (
    <div className="list-page-header">
      {/* 面包屑导航 */}
      {renderBreadcrumb()}
      
      {/* 页面头部信息 */}
      <div className="list-page-header__content">
        <div className="list-page-header__info">
          <h1 className="list-page-header__title">{title}</h1>
          {description && (
            <p className="list-page-header__description">{description}</p>
          )}
        </div>
        
        {/* 操作按钮区域 */}
        {renderActions()}
      </div>
    </div>
  );
};

export default ListPageHeader;