import React, { useState, useCallback, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Form, Row, Col, Pagination, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableProps, PaginationProps } from 'antd';
import type { ReactNode } from 'react';

// 简化的类型定义
export interface TableColumn {
  title: string;
  dataIndex?: string;
  key: string;
  width?: number | string;
  ellipsis?: boolean | { showTitle?: boolean };
  render?: (text: any, record: any, index: number) => ReactNode;
  sorter?: ((a: any, b: any) => number) | boolean;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'input' | 'select';
  placeholder?: string;
  options?: { value: any; label: string }[];
}

export interface BatchAction {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick: (selectedRowKeys: React.Key[]) => void;
}

export interface HeaderAction {
  key: string;
  label: string;
  type?: 'primary' | 'default';
  icon?: ReactNode;
  onClick: () => void;
}

export interface ActionButton {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick: (record: any) => void;
}

export interface UnifiedListPageProps<T = any> {
  title: string;
  description?: string;
  dataSource: T[];
  columns: TableColumn[];
  loading?: boolean;
  filterOptions?: FilterOption[];
  onSearch?: (searchText: string, dataSource: T[]) => T[];
  batchActions?: BatchAction[];
  rowKey: string;
  headerActions?: HeaderAction[];
  actionButtons?: ActionButton[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: (total: number) => string;
    onChange?: (page: number, pageSize?: number) => void;
    onShowSizeChange?: (current: number, size: number) => void;
  };
}

export function UnifiedListPage<T = any>(props: UnifiedListPageProps<T>) {
  const {
    title,
    description,
    dataSource,
    columns,
    loading = false,
    filterOptions = [],
    onSearch,
    batchActions = [],
    rowKey,
    headerActions = [],
    actionButtons = [],
    pagination,
  } = props;

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<T[]>(dataSource || []);

  // 监听dataSource变化，更新filteredData
  useEffect(() => {
    setFilteredData(dataSource || []);
  }, [dataSource]);

  // 处理搜索
  const handleSearch = useCallback((values: any) => {
    const searchValue = values.search || '';
    setSearchText(searchValue);
    
    const safeDataSource = dataSource || [];
    if (onSearch) {
      const filtered = onSearch(searchValue, safeDataSource);
      setFilteredData(filtered);
    } else {
      setFilteredData(safeDataSource);
    }
  }, [dataSource, onSearch]);

  // 重置搜索
  const handleReset = useCallback(() => {
    form.resetFields();
    setSearchText('');
    setFilteredData(dataSource || []);
  }, [form, dataSource]);

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // 构建表格列（包含操作列）
  const tableColumns = [...columns];
  if (actionButtons.length > 0) {
    tableColumns.push({
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (_: any, record: T) => (
        <Space size="middle">
          {actionButtons.map(action => (
            <Button
              key={action.key}
              type="text"
              icon={action.icon}
              danger={action.danger}
              onClick={() => action.onClick(record)}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      ),
    });
  }

  return (
    <Card title={title}>
      {description && (
        <div style={{ marginBottom: 16, color: '#666' }}>
          {description}
        </div>
      )}
      
      {/* 搜索表单 */}
      {filterOptions.length > 0 && (
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          {filterOptions.map(option => (
            <Form.Item key={option.key} name={option.key} label={option.label}>
              {option.type === 'input' ? (
                <Input placeholder={option.placeholder} allowClear />
              ) : (
                <Select
                  placeholder={option.placeholder}
                  allowClear
                  options={option.options}
                />
              )}
            </Form.Item>
          ))}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {/* 操作按钮 */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Space>
            {headerActions.map(action => (
              <Button
                key={action.key}
                type={action.type || 'default'}
                icon={action.icon}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
            {batchActions.map(action => (
              <Button
                key={action.key}
                danger={action.danger}
                disabled={selectedRowKeys.length === 0}
                onClick={() => action.onClick(selectedRowKeys)}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        </Col>
      </Row>

      {/* 数据表格 */}
      <Table
        rowKey={rowKey}
        rowSelection={batchActions.length > 0 ? rowSelection : undefined}
        columns={tableColumns}
        dataSource={filteredData}
        loading={loading}
        pagination={false}
      />

      {/* 分页 */}
      {pagination && (
        <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger={pagination.showSizeChanger}
              showQuickJumper={pagination.showQuickJumper}
              showTotal={pagination.showTotal}
              onChange={pagination.onChange}
              onShowSizeChange={pagination.onShowSizeChange}
            />
          </Col>
        </Row>
      )}
    </Card>
  );
}

export default UnifiedListPage;