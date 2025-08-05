import { ReactNode } from 'react';
import { TableProps, TableColumnType, ButtonProps, InputProps, SelectProps, DatePickerProps } from 'antd';

// ===== 枚举类型定义 =====

// 过滤器类型
export enum FilterType {
  INPUT = 'input',
  SELECT = 'select',
  MULTI_SELECT = 'multiSelect',
  DATE_RANGE = 'dateRange',
  DATE = 'date'
}

// 操作类型
export enum ActionType {
  PRIMARY = 'primary',
  DEFAULT = 'default',
  DANGER = 'danger',
  LINK = 'link'
}

// 表格尺寸
export enum TableSize {
  SMALL = 'small',
  MIDDLE = 'middle',
  LARGE = 'large'
}

// 基础配置接口
export interface BaseListPageConfig {
  title: string;
  description?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: BreadcrumbItem[];
}

// 面包屑项接口
export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

// 搜索过滤配置接口
export interface SearchFilterConfig {
  searchPlaceholder?: string;
  showSearch?: boolean;
  filters?: FilterItem[];
  onSearch?: (value: string) => void;
  onFilterChange?: (filterKey: string, value: any) => void;
  onReset?: () => void;
}

// 过滤项接口
export interface FilterItem {
  key: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: any }[];
  placeholder?: string;
  defaultValue?: any;
  props?: InputProps | SelectProps | DatePickerProps;
}

// 批量操作配置接口
export interface BatchOperationConfig {
  showBatchActions?: boolean;
  batchActions?: BatchAction[];
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: any[]) => void;
}

// 批量操作项接口
export interface BatchAction {
  key: string;
  label: string;
  icon?: ReactNode;
  type?: ActionType;
  danger?: boolean;
  disabled?: boolean | ((selectedRows: any[]) => boolean);
  confirm?: {
    title: string;
    content?: string;
  };
  onClick: (selectedRowKeys: React.Key[], selectedRows: any[]) => void | Promise<void>;
}

// 表格配置接口
export interface UnifiedTableConfig<T = any> extends Omit<TableProps<T>, 'columns' | 'dataSource'> {
  columns: UnifiedTableColumn<T>[];
  dataSource: T[];
  showRowSelection?: boolean;
  rowSelectionType?: 'checkbox' | 'radio';
  actionColumn?: ActionColumnConfig<T>;
  emptyText?: string;
  emptyDescription?: string;
  emptyImage?: ReactNode;
}

// 统一表格列配置接口
export interface UnifiedTableColumn<T = any> extends Omit<TableColumnType<T>, 'dataIndex'> {
  key: string;
  dataIndex?: string | string[];
  title: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
}

// 操作列配置接口
export interface ActionColumnConfig<T = any> {
  title?: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  actions: ActionItem<T>[];
}

// 操作项接口
export interface ActionItem<T = any> {
  key: string;
  label: string;
  icon?: ReactNode;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  disabled?: boolean | ((record: T) => boolean);
  visible?: boolean | ((record: T) => boolean);
  onClick: (record: T, index: number) => void;
}

// 分页配置接口
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode);
  pageSizeOptions?: string[];
  onChange?: (page: number, pageSize: number) => void;
}

// 页面头部操作配置接口
export interface HeaderActionConfig {
  actions?: HeaderAction[];
  primaryAction?: HeaderAction;
}

// 页面头部操作项接口
export interface HeaderAction {
  key: string;
  label: string;
  icon?: ReactNode;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

// 统一列表页面完整配置接口
export interface UnifiedListPageProps<T = any> {
  // 基础配置
  config: BaseListPageConfig;
  
  // 搜索过滤配置
  searchFilterConfig?: SearchFilterConfig;
  
  // 批量操作配置
  batchOperationConfig?: BatchOperationConfig;
  
  // 表格配置
  tableConfig: UnifiedTableConfig<T>;
  
  // 分页配置
  paginationConfig?: PaginationConfig;
  
  // 页面头部操作配置
  headerActionConfig?: HeaderActionConfig;
  
  // 加载状态
  loading?: boolean;
  
  // 自定义样式类名
  className?: string;
  
  // 自定义样式
  style?: React.CSSProperties;
}

// 列表页面状态接口
export interface ListPageState {
  loading: boolean;
  searchText: string;
  filters: Record<string, any>;
  selectedRowKeys: React.Key[];
  selectedRows: any[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

// 列表页面操作接口
export interface ListPageActions {
  setLoading: (loading: boolean) => void;
  setSearchText: (searchText: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSelectedRowKeys: (keys: React.Key[]) => void;
  setSelectedRows: (rows: any[]) => void;
  setPagination: (pagination: Partial<ListPageState['pagination']>) => void;
  resetFilters: () => void;
  refreshData: () => void;
}

// ===== 组件Props接口定义 =====

// 页面头部组件Props
export interface ListPageHeaderProps {
  config: BaseListPageConfig;
  actionConfig?: HeaderActionConfig;
  extra?: ReactNode;
}

// 搜索过滤器组件Props
export interface SearchFilterAreaProps {
  config: SearchFilterConfig;
  onSearch?: (value: string) => void;
  onFilterChange?: (filterKey: string, value: any) => void;
  onReset?: () => void;
}

// 批量操作栏组件Props
export interface BatchOperationAreaProps {
  config: BatchOperationConfig;
  selectedRowKeys: React.Key[];
  selectedRows: any[];
  onClearSelection?: () => void;
}

// 统一表格组件Props
export interface UnifiedTableProps<T = any> {
  config: UnifiedTableConfig<T>;
  loading?: boolean;
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
}

// 分页组件Props
export interface PaginationProps {
  config: PaginationConfig;
  onChange?: (page: number, pageSize: number) => void;
}

// 表格操作列组件Props
export interface ActionColumnProps<T = any> {
  config: ActionColumnConfig<T>;
  record: T;
  index: number;
}

// 所有类型已在上面定义并自动导出