// UnifiedListPage 统一列表页面组件导出文件
// Unified List Page Components Export

// 主容器组件
export { default as UnifiedListPage } from './UnifiedListPage';

// 子组件导出
export { default as ListPageHeader } from './ListPageHeader';
export { default as SearchFilterArea } from './SearchFilterArea';
export { default as BatchOperationArea } from './BatchOperationArea';
export { default as UnifiedTable } from './UnifiedTable';

// 类型定义导出
export type {
  // 主要配置接口
  BaseListPageConfig,
  SearchFilterConfig,
  BatchOperationConfig,
  UnifiedTableConfig,
  PaginationConfig,
  HeaderActionConfig,
  
  // 组件属性接口
  UnifiedListPageProps,
  ListPageHeaderProps,
  SearchFilterAreaProps,
  BatchOperationAreaProps,
  UnifiedTableProps,
  
  // 状态和操作接口
  ListPageState,
  ListPageActions,
  
  // 子接口
  FilterItem,
  BatchAction,
  BreadcrumbItem,
  
  // 枚举类型
  FilterType,
  ActionType,
  TableSize
} from './types';

// 样式文件导出（可选）
import './unified-styles.css';