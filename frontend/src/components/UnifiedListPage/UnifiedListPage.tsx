import React, { useState, useCallback, useMemo } from 'react';
import { Card, Spin } from 'antd';
import ListPageHeader from './ListPageHeader';
import SearchFilterArea from './SearchFilterArea';
import BatchOperationArea from './BatchOperationArea';
import UnifiedTable from './UnifiedTable';
import {
  UnifiedListPageProps,
  ListPageState,
  ListPageActions,
} from './types';
import './style.css';

/**
 * 统一列表页面主容器组件
 * 提供完整的列表页面功能，包括页面头部、搜索过滤、批量操作、表格展示等
 */
export function UnifiedListPage<T = any>(props: UnifiedListPageProps<T>) {
  const {
    config,
    searchFilterConfig,
    batchOperationConfig,
    tableConfig,
    paginationConfig,
    headerActionConfig,
    loading = false,
    className = '',
    style,
  } = props;

  // 内部状态管理
  const [state, setState] = useState<ListPageState>({
    loading: false,
    searchText: '',
    filters: {},
    selectedRowKeys: batchOperationConfig?.selectedRowKeys || [],
    selectedRows: [],
    pagination: {
      current: paginationConfig?.current || 1,
      pageSize: paginationConfig?.pageSize || 10,
      total: paginationConfig?.total || 0,
    },
  });

  // 状态操作方法
  const actions: ListPageActions = useMemo(() => ({
    setLoading: (loading: boolean) => {
      setState(prev => ({ ...prev, loading }));
    },
    setSearchText: (searchText: string) => {
      setState(prev => ({ ...prev, searchText }));
    },
    setFilters: (filters: Record<string, any>) => {
      setState(prev => ({ ...prev, filters }));
    },
    setSelectedRowKeys: (keys: React.Key[]) => {
      setState(prev => ({ ...prev, selectedRowKeys: keys }));
    },
    setSelectedRows: (rows: any[]) => {
      setState(prev => ({ ...prev, selectedRows: rows }));
    },
    setPagination: (pagination: Partial<ListPageState['pagination']>) => {
      setState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, ...pagination },
      }));
    },
    resetFilters: () => {
      setState(prev => ({
        ...prev,
        searchText: '',
        filters: {},
        selectedRowKeys: [],
        selectedRows: [],
      }));
    },
    refreshData: () => {
      // 触发数据刷新的逻辑
      // 这里可以调用父组件传入的刷新方法
    },
  }), []);

  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    actions.setSearchText(value);
    searchFilterConfig?.onSearch?.(value);
  }, [actions, searchFilterConfig]);

  // 处理过滤器变化
  const handleFilterChange = useCallback((filterKey: string, value: any) => {
    const newFilters = { ...state.filters, [filterKey]: value };
    actions.setFilters(newFilters);
    searchFilterConfig?.onFilterChange?.(filterKey, value);
  }, [actions, state.filters, searchFilterConfig]);

  // 处理重置
  const handleReset = useCallback(() => {
    actions.resetFilters();
    searchFilterConfig?.onReset?.();
  }, [actions, searchFilterConfig]);

  // 处理行选择变化
  const handleSelectionChange = useCallback((selectedRowKeys: React.Key[], selectedRows: any[]) => {
    actions.setSelectedRowKeys(selectedRowKeys);
    actions.setSelectedRows(selectedRows);
    batchOperationConfig?.onSelectionChange?.(selectedRowKeys, selectedRows);
  }, [actions, batchOperationConfig]);

  // 处理分页变化
  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    actions.setPagination({ current: page, pageSize });
    paginationConfig?.onChange?.(page, pageSize);
  }, [actions, paginationConfig]);

  // 合并表格配置
  const mergedTableConfig = useMemo(() => ({
    ...tableConfig,
    rowSelection: batchOperationConfig?.showBatchActions ? {
      type: tableConfig.rowSelectionType || 'checkbox',
      selectedRowKeys: state.selectedRowKeys,
      onChange: handleSelectionChange,
    } : undefined,
  }), [tableConfig, batchOperationConfig, state, handleSelectionChange]);

  // 分页配置
  const mergedPaginationConfig = useMemo(() => {
    if (!paginationConfig) return undefined;
    return {
      ...paginationConfig,
      current: state.pagination.current,
      pageSize: state.pagination.pageSize,
      total: state.pagination.total,
      onChange: handlePaginationChange,
    };
  }, [paginationConfig, state.pagination, handlePaginationChange]);

  // 合并搜索过滤配置
  const mergedSearchFilterConfig = useMemo(() => ({
    ...searchFilterConfig,
    onSearch: handleSearch,
    onFilterChange: handleFilterChange,
    onReset: handleReset,
  }), [searchFilterConfig, handleSearch, handleFilterChange, handleReset]);

  // 合并批量操作配置
  const mergedBatchOperationConfig = useMemo(() => ({
    ...batchOperationConfig,
    selectedRowKeys: state.selectedRowKeys,
    onSelectionChange: handleSelectionChange,
  }), [batchOperationConfig, state.selectedRowKeys, handleSelectionChange]);

  // 计算是否显示加载状态
  const isLoading = loading || state.loading;

  return (
    <div className={`unified-list-page ${className}`} style={style}>
      <Spin spinning={isLoading}>
        {/* 页面头部 */}
        <ListPageHeader
          config={config}
          actionConfig={headerActionConfig}
        />

        {/* 主要内容区域 */}
        <Card className="unified-list-page__content" bordered={false}>
          {/* 搜索过滤区域 */}
          {searchFilterConfig && (
            <SearchFilterArea
              config={mergedSearchFilterConfig}
              searchText={state.searchText}
              filters={state.filters}
            />
          )}

          {/* 批量操作区域 */}
          {batchOperationConfig?.showBatchActions && state.selectedRowKeys.length > 0 && (
            <BatchOperationArea
              config={mergedBatchOperationConfig}
              selectedRows={state.selectedRows}
            />
          )}

          {/* 表格区域 */}
          <UnifiedTable 
            config={mergedTableConfig} 
            paginationConfig={mergedPaginationConfig}
          />
        </Card>
      </Spin>
    </div>
  );
}

// 导出组件和相关类型
export * from './types';
export { default as ListPageHeader } from './ListPageHeader';
export { default as SearchFilterArea } from './SearchFilterArea';
export { default as BatchOperationArea } from './BatchOperationArea';
export { default as UnifiedTable } from './UnifiedTable';

export default UnifiedListPage;