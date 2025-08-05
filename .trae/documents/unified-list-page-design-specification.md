# 统一列表页面设计规范

## 1. 设计概述

本文档定义了英语学习系统前端各模块列表页面的统一设计规范，旨在提供一致的用户体验和视觉风格。适用于所有模块的列表页面，包括文章管理、单词管理、听写练习管理等。

### 1.1 设计原则

- **一致性**：所有列表页面采用统一的布局结构和视觉风格
- **易用性**：清晰的信息层次和直观的操作流程
- **响应式**：适配不同屏幕尺寸的设备
- **可扩展性**：支持不同模块的个性化需求
- **性能优化**：高效的数据展示和交互体验

## 2. 整体布局结构

### 2.1 页面容器

```css
.page-container {
  padding: 24px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
```

### 2.2 布局层次

1. **页面头部** (Page Header)
2. **搜索筛选区域** (Search & Filter Section)
3. **批量操作区域** (Batch Actions - 条件显示)
4. **表格容器** (Table Container)
   - 表格主体
   - 分页器

## 3. 页面头部设计

### 3.1 结构组成

```html
<div class="page-header">
  <h1 class="page-title">页面标题</h1>
  <div class="page-actions">
    <!-- 主要操作按钮 -->
  </div>
</div>
```

### 3.2 样式规范

- **背景色**：#ffffff
- **内边距**：20px 24px
- **圆角**：8px
- **阴影**：0 2px 8px rgba(0, 0, 0, 0.06)
- **标题字体**：24px, 字重600, 颜色#262626
- **按钮间距**：12px

### 3.3 响应式适配

```css
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
```

## 4. 搜索筛选区域设计

### 4.1 结构组成

```html
<div class="search-filter-section">
  <div class="search-row">
    <input type="text" class="input search-input" placeholder="搜索...">
    <div class="filter-group">
      <select class="select">筛选选项</select>
      <button class="btn">搜索</button>
      <button class="btn">重置</button>
    </div>
  </div>
</div>
```

### 4.2 样式规范

- **背景色**：#ffffff
- **内边距**：20px 24px
- **圆角**：8px
- **阴影**：0 2px 8px rgba(0, 0, 0, 0.06)
- **元素间距**：16px
- **搜索框最大宽度**：300px

### 4.3 组件规范

#### 搜索输入框
- 占位符文本应明确说明可搜索的字段
- 支持回车键触发搜索
- 最小宽度200px，最大宽度300px

#### 筛选下拉框
- 提供"全部"选项作为默认值
- 选项文本应简洁明了
- 支持清空选择

## 5. 批量操作区域设计

### 5.1 显示条件

- 仅在有选中项时显示
- 使用滑入动画效果

### 5.2 结构组成

```html
<div class="batch-actions">
  <div class="selected-info">
    <span>已选择</span>
    <span class="selected-count">0</span>
    <span>项</span>
  </div>
  <div class="batch-buttons">
    <button class="btn small">清除选择</button>
    <button class="btn small danger">批量删除</button>
  </div>
</div>
```

### 5.3 样式规范

- **背景色**：linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)
- **边框**：1px solid #91d5ff
- **内边距**：12px 20px
- **圆角**：6px
- **动画**：slideDown 0.3s ease-out

## 6. 表格设计规范

### 6.1 表格容器

```css
.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}
```

### 6.2 表格样式

#### 表头样式
- **背景色**：#fafafa
- **内边距**：16px
- **字体**：14px, 字重600, 颜色#262626
- **边框**：底部1px solid #f0f0f0

#### 表格行样式
- **内边距**：16px
- **边框**：底部1px solid #f0f0f0
- **悬停效果**：背景色#fafafa
- **选中效果**：背景色#e6f7ff

### 6.3 表格内容规范

#### 链接样式
```css
.table-link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
}

.table-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}
```

#### 内容预览
```css
.content-preview {
  color: #666;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

#### 标签样式
```css
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
}
```

### 6.4 标签颜色规范

#### 难度标签
- **初级**：背景#f6ffed, 边框#b7eb8f, 文字#52c41a
- **中级**：背景#fff7e6, 边框#ffd591, 文字#fa8c16
- **高级**：背景#fff2f0, 边框#ffb3b3, 文字#ff4d4f

#### 状态标签
- **草稿**：背景#f0f0f0, 边框#d9d9d9, 文字#666
- **已发布**：背景#f6ffed, 边框#b7eb8f, 文字#52c41a

## 7. 分页器设计

### 7.1 结构组成

```html
<div class="pagination">
  <div class="pagination-info">
    共 <span id="totalCount">0</span> 条记录
  </div>
  <div class="pagination-controls">
    <button class="btn small">上一页</button>
    <span>第 1 页，共 1 页</span>
    <button class="btn small">下一页</button>
    <select class="select">
      <option value="10">10条/页</option>
      <option value="20">20条/页</option>
      <option value="50">50条/页</option>
    </select>
  </div>
</div>
```

### 7.2 样式规范

- **内边距**：20px 24px
- **背景色**：#fafafa
- **边框**：顶部1px solid #f0f0f0
- **布局**：两端对齐
- **元素间距**：16px

## 8. 按钮设计规范

### 8.1 基础按钮

```css
.btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}
```

### 8.2 按钮变体

#### 主要按钮
```css
.btn.primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}
```

#### 危险按钮
```css
.btn.danger {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}
```

#### 小尺寸按钮
```css
.btn.small {
  padding: 4px 8px;
  font-size: 12px;
}
```

#### 文本按钮
```css
.btn.text {
  border: none;
  background: transparent;
  padding: 4px 8px;
}
```

## 9. 表单控件规范

### 9.1 输入框

```css
.input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
```

### 9.2 下拉选择框

```css
.select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}
```

### 9.3 复选框

```css
.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
```

## 10. 响应式设计

### 10.1 断点定义

- **桌面端**：> 768px
- **移动端**：≤ 768px

### 10.2 移动端适配

```css
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .batch-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    min-width: 800px;
  }

  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}
```

## 11. 交互行为规范

### 11.1 选择交互

- **单选**：点击复选框或行选择
- **全选**：表头复选框控制当前页全选/取消全选
- **批量操作**：选中项大于0时显示批量操作区域

### 11.2 搜索交互

- **实时搜索**：输入框支持回车键触发
- **筛选联动**：多个筛选条件可组合使用
- **重置功能**：一键清空所有搜索和筛选条件

### 11.3 分页交互

- **页码跳转**：支持上一页/下一页按钮
- **页面大小**：支持动态调整每页显示数量
- **状态保持**：翻页时保持搜索和筛选状态

## 12. 数据状态处理

### 12.1 加载状态

- 表格显示加载动画
- 按钮显示loading状态
- 禁用相关操作

### 12.2 空数据状态

```html
<div class="empty-state">
  <div class="empty-icon">📄</div>
  <div class="empty-text">暂无数据</div>
  <button class="btn primary">添加数据</button>
</div>
```

### 12.3 错误状态

- 显示友好的错误提示
- 提供重试操作
- 记录错误日志

## 13. 可访问性规范

### 13.1 键盘导航

- 支持Tab键在可交互元素间切换
- 支持回车键触发按钮操作
- 支持空格键切换复选框状态

### 13.2 屏幕阅读器

- 为表格添加适当的标题和描述
- 为按钮添加aria-label属性
- 为状态变化添加aria-live区域

## 14. 性能优化建议

### 14.1 数据加载

- 实现分页加载，避免一次性加载大量数据
- 使用虚拟滚动处理超长列表
- 实现搜索防抖，避免频繁请求

### 14.2 渲染优化

- 使用React.memo优化组件重渲染
- 实现表格行的虚拟化
- 优化图片和图标的加载

## 15. 实施指南

### 15.1 组件化实现

建议创建以下可复用组件：

- `UnifiedListPage` - 统一列表页面容器
- `PageHeader` - 页面头部组件
- `SearchFilter` - 搜索筛选组件
- `BatchActions` - 批量操作组件
- `DataTable` - 数据表格组件
- `Pagination` - 分页器组件

### 15.2 样式实现

- 使用CSS变量定义主题色彩
- 创建统一的样式文件
- 支持主题切换功能

### 15.3 类型定义

```typescript
interface ListPageConfig {
  title: string;
  columns: ColumnConfig[];
  searchFields: SearchField[];
  filterOptions: FilterOption[];
  batchActions: BatchAction[];
}

interface ColumnConfig {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: any) => React.ReactNode;
  sorter?: boolean;
}
```

## 16. 测试建议

### 16.1 功能测试

- 搜索和筛选功能
- 分页和排序功能
- 批量操作功能
- 响应式布局测试

### 16.2 性能测试

- 大数据量渲染性能
- 搜索响应时间
- 内存使用情况

### 16.3 可访问性测试

- 键盘导航测试
- 屏幕阅读器测试
- 色彩对比度测试

通过遵循本设计规范，可以确保所有列表页面具有一致的用户体验和视觉效果，同时提高开发效率和代码可维护性。