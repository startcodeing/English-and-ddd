# React组件实现指南

## 1. 组件架构概述

基于统一列表页面设计规范，我们将创建一套可复用的React组件来实现各模块的列表页面。

### 1.1 组件层次结构

```
UnifiedListPage
├── PageHeader
├── SearchFilterSection
├── BatchActionsBar (条件渲染)
└── TableContainer
    ├── DataTable
    └── PaginationBar
```

### 1.2 核心组件列表

* `UnifiedListPage` - 主容器组件

* `PageHeader` - 页面头部

* `SearchFilterSection` - 搜索筛选区域

* `BatchActionsBar` - 批量操作栏

* `DataTable` - 数据表格

* `PaginationBar` - 分页器

* `ActionButton` - 操作按钮

* `StatusTag` - 状态标签

## 2. 类型定义

### 2.1 基础类型

```typescript
// types/list-page.ts
export interface ListPageConfig {
  title: string;
  columns: ColumnConfig[];
  searchPlaceholder?: string;
  searchFields?: string[];
  filterOptions?: FilterOption[];
  batchActions?: BatchActionConfig[];
  enableSelection?: boolean;
  pageSize?: number;
}

export interface ColumnConfig {
  key: string;
  title: string;
  dataIndex?: string;
  width?: string | number;
  ellipsis?: boolean;
  sorter?: boolean | ((a: any, b: any) => number);
  render?: (value: any, record: any, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface FilterOption {
  key: string;
  label: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export interface BatchActionConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: (selectedIds: React.Key[]) => void;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: string[];
}

export interface SearchFilterValues {
  searchText?: string;
  [key: string]: any;
}
```

### 2.2 组件Props类型

```typescript
// 主容器组件Props
export interface UnifiedListPageProps {
  config: ListPageConfig;
  data: any[];
  loading?: boolean;
  pagination: PaginationConfig;
  selectedRowKeys?: React.Key[];
  onSearch?: (values: SearchFilterValues) => void;
  onReset?: () => void;
  onSelectionChange?: (selectedRowKeys: React.Key[]) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  children?: React.ReactNode;
}

// 页面头部Props
export interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

// 搜索筛选Props
export interface SearchFilterSectionProps {
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  onSearch?: (values: SearchFilterValues) => void;
  onReset?: () => void;
}

// 批量操作Props
export interface BatchActionsBarProps {
  selectedCount: number;
  actions: BatchActionConfig[];
  selectedRowKeys: React.Key[];
  onClearSelection: () => void;
}

// 数据表格Props
export interface DataTableProps {
  columns: ColumnConfig[];
  data: any[];
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedRowKeys: React.Key[]) => void;
  enableSelection?: boolean;
}

// 分页器Props
export interface PaginationBarProps {
  pagination: PaginationConfig;
  onPageChange: (page: number, pageSize: number) => void;
}
```

## 3. 核心组件实现

### 3.1 UnifiedListPage 主容器组件

```tsx
// components/UnifiedListPage/index.tsx
import React from 'react';
import { PageHeader } from './PageHeader';
import { SearchFilterSection } from './SearchFilterSection';
import { BatchActionsBar } from './BatchActionsBar';
import { DataTable } from './DataTable';
import { PaginationBar } from './PaginationBar';
import { UnifiedListPageProps } from '../../types/list-page';
import './style.css';

export const UnifiedListPage: React.FC<UnifiedListPageProps> = ({
  config,
  data,
  loading = false,
  pagination,
  selectedRowKeys = [],
  onSearch,
  onReset,
  onSelectionChange,
  onPageChange,
  children
}) => {
  const hasSelection = selectedRowKeys.length > 0;

  return (
    <div className="unified-list-page">
      <PageHeader 
        title={config.title}
        actions={children}
      />
      
      <SearchFilterSection
        searchPlaceholder={config.searchPlaceholder}
        filterOptions={config.filterOptions}
        onSearch={onSearch}
        onReset={onReset}
      />
      
      {hasSelection && config.batchActions && (
        <BatchActionsBar
          selectedCount={selectedRowKeys.length}
          actions={config.batchActions}
          selectedRowKeys={selectedRowKeys}
          onClearSelection={() => onSelectionChange?.([])} 
        />
      )}
      
      <div className="table-container">
        <DataTable
          columns={config.columns}
          data={data}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={onSelectionChange}
          enableSelection={config.enableSelection}
        />
        
        <PaginationBar
          pagination={pagination}
          onPageChange={onPageChange!}
        />
      </div>
    </div>
  );
};
```

### 3.2 PageHeader 页面头部组件

```tsx
// components/UnifiedListPage/PageHeader.tsx
import React from 'react';
import { PageHeaderProps } from '../../types/list-page';

export const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {actions && (
        <div className="page-actions">
          {actions}
        </div>
      )}
    </div>
  );
};
```

### 3.3 SearchFilterSection 搜索筛选组件

```tsx
// components/UnifiedListPage/SearchFilterSection.tsx
import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SearchFilterSectionProps, SearchFilterValues } from '../../types/list-page';

const { Option } = Select;

export const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({
  searchPlaceholder = '搜索...',
  filterOptions = [],
  onSearch,
  onReset
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleSearch = () => {
    const values: SearchFilterValues = {
      searchText: searchText.trim(),
      ...filterValues
    };
    onSearch?.(values);
  };

  const handleReset = () => {
    setSearchText('');
    setFilterValues({});
    onReset?.();
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="search-filter-section">
      <div className="search-row">
        <Input
          className="search-input"
          placeholder={searchPlaceholder}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined />}
        />
        
        <div className="filter-group">
          {filterOptions.map(filter => (
            <Select
              key={filter.key}
              placeholder={filter.placeholder || filter.label}
              value={filterValues[filter.key]}
              onChange={value => handleFilterChange(filter.key, value)}
              allowClear
              style={{ minWidth: 120 }}
            >
              {filter.options.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          ))}
          
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### 3.4 BatchActionsBar 批量操作组件

```tsx
// components/UnifiedListPage/BatchActionsBar.tsx
import React from 'react';
import { Button, Space } from 'antd';
import { BatchActionsBarProps } from '../../types/list-page';

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedCount,
  actions,
  selectedRowKeys,
  onClearSelection
}) => {
  return (
    <div className="batch-actions">
      <div className="selected-info">
        <span>已选择</span>
        <span className="selected-count">{selectedCount}</span>
        <span>项</span>
      </div>
      
      <div className="batch-buttons">
        <Space>
          <Button size="small" onClick={onClearSelection}>
            清除选择
          </Button>
          {actions.map(action => (
            <Button
              key={action.key}
              size="small"
              danger={action.danger}
              icon={action.icon}
              onClick={() => action.onClick(selectedRowKeys)}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      </div>
    </div>
  );
};
```

### 3.5 DataTable 数据表格组件

```tsx
// components/UnifiedListPage/DataTable.tsx
import React from 'react';
import { Table } from 'antd';
import { DataTableProps } from '../../types/list-page';

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  selectedRowKeys = [],
  onSelectionChange,
  enableSelection = true
}) => {
  const rowSelection = enableSelection ? {
    selectedRowKeys,
    onChange: onSelectionChange,
    preserveSelectedRowKeys: true
  } : undefined;

  const tableColumns = columns.map(col => ({
    ...col,
    ellipsis: col.ellipsis !== false ? { showTitle: false } : false
  }));

  return (
    <Table
      className="data-table"
      columns={tableColumns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      rowSelection={rowSelection}
      pagination={false}
      scroll={{ x: true }}
      size="middle"
    />
  );
};
```

### 3.6 PaginationBar 分页器组件

```tsx
// components/UnifiedListPage/PaginationBar.tsx
import React from 'react';
import { Pagination } from 'antd';
import { PaginationBarProps } from '../../types/list-page';

export const PaginationBar: React.FC<PaginationBarProps> = ({
  pagination,
  onPageChange
}) => {
  const {
    current,
    pageSize,
    total,
    showSizeChanger = true,
    showQuickJumper = true,
    pageSizeOptions = ['10', '20', '50', '100']
  } = pagination;

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        共 {total} 条记录
      </div>
      
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        pageSizeOptions={pageSizeOptions}
        showTotal={(total, range) => 
          `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
        }
        onChange={onPageChange}
        onShowSizeChange={onPageChange}
      />
    </div>
  );
};
```

## 4. 辅助组件

### 4.1 ActionButton 操作按钮组件

```tsx
// components/ActionButton/index.tsx
import React from 'react';
import { Button, Tooltip } from 'antd';
import { ButtonProps } from 'antd/es/button';

interface ActionButtonProps extends ButtonProps {
  tooltip?: string;
  confirmMessage?: string;
  onConfirm?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  tooltip,
  confirmMessage,
  onConfirm,
  onClick,
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (confirmMessage && onConfirm) {
      if (window.confirm(confirmMessage)) {
        onConfirm();
      }
    } else {
      onClick?.(e);
    }
  };

  const button = (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>
      {button}
    </Tooltip>
  ) : button;
};
```

### 4.2 StatusTag 状态标签组件

```tsx
// components/StatusTag/index.tsx
import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
  statusConfig: Record<string, { label: string; color: string }>;
}

export const StatusTag: React.FC<StatusTagProps> = ({ status, statusConfig }) => {
  const config = statusConfig[status];
  
  if (!config) {
    return <span>{status}</span>;
  }

  return (
    <Tag color={config.color}>
      {config.label}
    </Tag>
  );
};

// 预定义的状态配置
export const difficultyStatusConfig = {
  easy: { label: '初级', color: 'green' },
  medium: { label: '中级', color: 'orange' },
  hard: { label: '高级', color: 'red' }
};

export const publishStatusConfig = {
  draft: { label: '草稿', color: 'default' },
  published: { label: '已发布', color: 'green' },
  archived: { label: '已归档', color: 'gray' }
};
```

## 5. 样式文件

### 5.1 主样式文件

```css
/* components/UnifiedListPage/style.css */
.unified-list-page {
  padding: 24px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 搜索筛选区域 */
.search-filter-section {
  background: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* 批量操作区域 */
.batch-actions {
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
  border: 1px solid #91d5ff;
  padding: 12px 20px;
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  font-weight: 500;
}

.selected-count {
  background: #1890ff;
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.batch-buttons {
  display: flex;
  gap: 8px;
}

/* 表格容器 */
.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 分页器 */
.pagination-bar {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .unified-list-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: none;
  }

  .batch-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .pagination-bar {
    flex-direction: column;
    gap: 12px;
  }
}
```

## 6. 使用示例

### 6.1 文章列表页面使用示例

```tsx
// pages/content/Article/index.tsx
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { UnifiedListPage } from '../../../components/UnifiedListPage';
import { ActionButton } from '../../../components/ActionButton';
import { StatusTag, difficultyStatusConfig } from '../../../components/StatusTag';
import { ListPageConfig, PaginationConfig } from '../../../types/list-page';
import { getAllArticles, deleteArticle, batchDeleteArticles } from '../../../api/article';
import { Article } from '../../../types';
import { useNavigate } from 'react-router-dom';

const ArticleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 列配置
  const columns = [
    {
      key: 'title',
      title: '标题',
      dataIndex: 'title',
      width: '20%',
      render: (text: string, record: Article) => (
        <a onClick={() => navigate(`/content/article/read/${record.id}`)}>
          {text}
        </a>
      )
    },
    {
      key: 'content',
      title: '内容',
      dataIndex: 'content',
      width: '30%',
      ellipsis: true
    },
    {
      key: 'author',
      title: '作者/来源',
      width: '15%',
      render: (_: any, record: Article) => (
        <div>
          <div>{record.author}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.source}</div>
        </div>
      )
    },
    {
      key: 'publishDate',
      title: '发布日期',
      dataIndex: 'publishDate',
      width: '12%'
    },
    {
      key: 'difficultyLevel',
      title: '难度',
      dataIndex: 'difficultyLevel',
      width: '10%',
      render: (level: string) => (
        <StatusTag status={level} statusConfig={difficultyStatusConfig} />
      )
    },
    {
      key: 'action',
      title: '操作',
      width: '13%',
      render: (_: any, record: Article) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton
            type="text"
            size="small"
            icon={<EyeOutlined />}
            tooltip="阅读"
            onClick={() => navigate(`/content/article/read/${record.id}`)}
          />
          <ActionButton
            type="text"
            size="small"
            icon={<EditOutlined />}
            tooltip="编辑"
            onClick={() => navigate(`/content/article/edit/${record.id}`)}
          />
          <ActionButton
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            tooltip="删除"
            confirmMessage="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
          />
        </div>
      )
    }
  ];

  // 页面配置
  const config: ListPageConfig = {
    title: '文章管理',
    columns,
    searchPlaceholder: '搜索标题、内容、作者或来源',
    filterOptions: [
      {
        key: 'difficultyLevel',
        label: '难度',
        placeholder: '选择难度',
        options: [
          { value: 'easy', label: '初级
```

