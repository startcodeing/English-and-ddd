import React, { useMemo } from 'react';
import { Table, Button, Space, Tooltip, Empty, Typography } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  UnifiedTableConfig,
  UnifiedTableColumn,
  ActionItem,
  PaginationConfig,
} from '../types';
import './style.css';

const { Text } = Typography;

export interface UnifiedTableProps<T = any> {
  config: UnifiedTableConfig<T>;
  paginationConfig?: PaginationConfig;
}

/**
 * 统一表格组件
 * 提供标准化的表格展示，包括数据展示、操作列、分页等功能
 */
export function UnifiedTable<T = any>(props: UnifiedTableProps<T>) {
  const { config, paginationConfig } = props;
  const {
    columns,
    dataSource,
    actionColumn,
    emptyText = '暂无数据',
    emptyDescription = '当前没有任何数据，请尝试添加或调整筛选条件',
    emptyImage,
    ...tableProps
  } = config;

  // 处理操作列渲染
  const renderActionColumn = (actions: ActionItem<T>[], record: T, index: number) => {
    // 过滤可见的操作
    const visibleActions = actions.filter(action => {
      if (typeof action.visible === 'function') {
        return action.visible(record);
      }
      return action.visible !== false;
    });

    if (visibleActions.length === 0) {
      return null;
    }

    // 如果操作数量较少，直接显示按钮
    if (visibleActions.length <= 3) {
      return (
        <Space size="small">
          {visibleActions.map((action) => {
            const isDisabled = typeof action.disabled === 'function' 
              ? action.disabled(record) 
              : action.disabled;

            return (
              <Tooltip key={action.key} title={action.label}>
                <Button
                  type={action.type || 'text'}
                  size="small"
                  danger={action.danger}
                  disabled={isDisabled}
                  icon={action.icon}
                  onClick={() => action.onClick(record, index)}
                  className="unified-table__action-btn"
                >
                  {visibleActions.length === 1 ? action.label : ''}
                </Button>
              </Tooltip>
            );
          })}
        </Space>
      );
    }

    // 如果操作数量较多，使用下拉菜单
    const primaryActions = visibleActions.slice(0, 2);
    const moreActions = visibleActions.slice(2);

    return (
      <Space size="small">
        {primaryActions.map((action) => {
          const isDisabled = typeof action.disabled === 'function' 
            ? action.disabled(record) 
            : action.disabled;

          return (
            <Tooltip key={action.key} title={action.label}>
              <Button
                type={action.type || 'text'}
                size="small"
                danger={action.danger}
                disabled={isDisabled}
                icon={action.icon}
                onClick={() => action.onClick(record, index)}
                className="unified-table__action-btn"
              />
            </Tooltip>
          );
        })}
        
        {moreActions.length > 0 && (
          <Tooltip title="更多操作">
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              className="unified-table__action-btn"
              // 这里可以添加下拉菜单逻辑
            />
          </Tooltip>
        )}
      </Space>
    );
  };

  // 合并列配置
  const mergedColumns = useMemo(() => {
    const processedColumns: any[] = columns.map((col: UnifiedTableColumn<T>) => {
      const column = { ...col };

      // 处理排序
      if (col.sortable) {
        column.sorter = true;
      }

      // 处理过滤
      if (col.filterable && col.filters) {
        column.filters = col.filters;
        column.onFilter = (value: any, record: T) => {
          const fieldValue = record[col.dataIndex as keyof T];
          return fieldValue === value;
        };
      }

      // 处理文本省略
      if (col.ellipsis) {
        column.ellipsis = {
          showTitle: false,
        };
        
        const originalRender = col.render;
        column.render = (value: any, record: T, index: number) => {
          const content = originalRender ? originalRender(value, record, index) : value;
          return (
            <Tooltip title={content} placement="topLeft">
              <Text ellipsis>{content}</Text>
            </Tooltip>
          );
        };
      }

      return column;
    });

    // 添加操作列
    if (actionColumn && actionColumn.actions.length > 0) {
      processedColumns.push({
        title: actionColumn.title || '操作',
        key: 'actions',
        width: actionColumn.width || 120,
        fixed: actionColumn.fixed,
        render: (text: any, record: T, index: number) => 
          renderActionColumn(actionColumn.actions, record, index),
      });
    }

    return processedColumns;
  }, [columns, actionColumn]);

  // 自定义空状态
  const customEmpty = (
    <Empty
      image={emptyImage || <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
      description={
        <div className="unified-table__empty">
          <Text type="secondary" className="unified-table__empty-text">
            {emptyText}
          </Text>
          <Text type="secondary" className="unified-table__empty-description">
            {emptyDescription}
          </Text>
        </div>
      }
    />
  );

  return (
    <div className="unified-table">
      <Table<T>
        {...tableProps}
        columns={mergedColumns}
        dataSource={dataSource}
        pagination={paginationConfig ? {
          current: paginationConfig.current,
          pageSize: paginationConfig.pageSize,
          total: paginationConfig.total,
          showSizeChanger: paginationConfig.showSizeChanger,
          showQuickJumper: paginationConfig.showQuickJumper,
          showTotal: typeof paginationConfig.showTotal === 'function' 
            ? paginationConfig.showTotal 
            : paginationConfig.showTotal ? (total: number, range: [number, number]) => `共 ${total} 条` : undefined,
          pageSizeOptions: paginationConfig.pageSizeOptions,
          onChange: paginationConfig.onChange,
        } : false}
        locale={{ emptyText: customEmpty }}
        scroll={{ x: 'max-content' }}
        className="unified-table__table"
        size="middle"
        bordered={false}
        showSorterTooltip={false}
      />
    </div>
  );
}

export default UnifiedTable;