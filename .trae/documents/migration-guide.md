# 列表页面迁移指南

## 1. 迁移概述

本指南将帮助您将现有的列表页面（Article、Word、DictationPractice等）迁移到新的统一设计系统。迁移过程分为分析、重构、测试和优化四个阶段。

### 1.1 迁移目标

- 统一所有列表页面的视觉风格和交互体验
- 提高代码复用性和可维护性
- 改善页面性能和响应式体验
- 增强无障碍访问支持

### 1.2 迁移范围

需要迁移的页面包括：
- 文章管理页面 (`/content/article`)
- 单词管理页面 (`/vocabulary/word`)
- 听写练习页面 (`/practice/dictation`)
- 写作主题管理页面 (`/practice/writing-topic`)
- 写作练习页面 (`/practice/writing`)
- 词性管理页面 (`/vocabulary/part-of-speech`)
- 单词本管理页面 (`/vocabulary/wordbook`)
- 句子管理页面 (`/content/sentence`)
- 听力材料页面 (`/content/listening-material`)

## 2. 迁移前准备

### 2.1 环境准备

1. **备份现有代码**
```bash
git checkout -b feature/unified-list-pages
git add .
git commit -m "backup: 保存现有列表页面实现"
```

2. **安装依赖**
```bash
npm install @ant-design/icons
npm install classnames
npm install lodash
```

3. **创建组件目录结构**
```
src/
├── components/
│   ├── UnifiedListPage/
│   │   ├── index.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SearchFilterSection.tsx
│   │   ├── BatchActionsBar.tsx
│   │   ├── DataTable.tsx
│   │   ├── PaginationBar.tsx
│   │   └── style.css
│   ├── ActionButton/
│   │   ├── index.tsx
│   │   └── style.css
│   └── StatusTag/
│       ├── index.tsx
│       └── style.css
├── types/
│   └── list-page.ts
└── utils/
    └── list-page-helpers.ts
```

### 2.2 类型定义文件

创建 `src/types/list-page.ts`：
```typescript
// 参考 React组件实现指南中的类型定义
export interface ListPageConfig {
  // ... 类型定义
}
```

## 3. 分阶段迁移计划

### 3.1 第一阶段：核心组件开发（1-2天）

1. **创建基础组件**
   - UnifiedListPage 主容器
   - PageHeader 页面头部
   - SearchFilterSection 搜索筛选
   - DataTable 数据表格
   - PaginationBar 分页器

2. **创建辅助组件**
   - ActionButton 操作按钮
   - StatusTag 状态标签
   - BatchActionsBar 批量操作

### 3.2 第二阶段：样式系统（1天）

1. **导入统一样式文件**
2. **配置CSS变量**
3. **测试响应式布局**

### 3.3 第三阶段：页面迁移（3-4天）

按优先级顺序迁移：
1. Article 文章管理页面（最复杂，作为模板）
2. Word 单词管理页面
3. DictationPractice 听写练习页面
4. WritingTopic 写作主题管理页面
5. WritingPractice 写作练习页面
6. 其他页面

### 3.4 第四阶段：测试和优化（1-2天）

1. **功能测试**
2. **性能优化**
3. **无障碍测试**
4. **浏览器兼容性测试**

## 4. 详细迁移步骤

### 4.1 Article页面迁移示例

#### 步骤1：分析现有实现

现有Article页面的关键特性：
- 搜索功能（标题、内容、作者、来源）
- 难度级别筛选
- 批量删除
- 分页
- 操作按钮（阅读、编辑、删除）

#### 步骤2：配置页面参数

```typescript
// pages/content/Article/config.ts
import { ListPageConfig } from '../../../types/list-page';
import { ArticleColumns } from './columns';
import { ArticleFilters } from './filters';
import { ArticleBatchActions } from './batch-actions';

export const articlePageConfig: ListPageConfig = {
  title: '文章管理',
  columns: ArticleColumns,
  searchPlaceholder: '搜索标题、内容、作者或来源',
  filterOptions: ArticleFilters,
  batchActions: ArticleBatchActions,
  enableSelection: true,
  pageSize: 10
};
```

#### 步骤3：定义表格列

```typescript
// pages/content/Article/columns.tsx
import React from 'react';
import { ColumnConfig } from '../../../types/list-page';
import { ActionButton } from '../../../components/ActionButton';
import { StatusTag, difficultyStatusConfig } from '../../../components/StatusTag';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Article } from '../../../types';

export const ArticleColumns: ColumnConfig[] = [
  {
    key: 'title',
    title: '标题',
    dataIndex: 'title',
    width: '20%',
    render: (text: string, record: Article) => (
      <a 
        className="table-link"
        onClick={() => window.open(`/content/article/read/${record.id}`, '_blank')}
      >
        {text}
      </a>
    )
  },
  {
    key: 'content',
    title: '内容',
    dataIndex: 'content',
    width: '30%',
    ellipsis: true,
    render: (text: string) => (
      <div className="table-ellipsis" title={text}>
        {text}
      </div>
    )
  },
  {
    key: 'author',
    title: '作者/来源',
    width: '15%',
    render: (_: any, record: Article) => (
      <div>
        <div style={{ fontWeight: 500 }}>{record.author}</div>
        <div style={{ color: '#666', fontSize: '12px' }}>{record.source}</div>
      </div>
    )
  },
  {
    key: 'publishDate',
    title: '发布日期',
    dataIndex: 'publishDate',
    width: '12%',
    sorter: (a: Article, b: Article) => 
      new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
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
    key: 'stats',
    title: '统计',
    width: '10%',
    render: (_: any, record: Article) => (
      <div style={{ fontSize: '12px', color: '#666' }}>
        <div>句子: {record.sentences?.length || 0}</div>
        <div>生词: {record.unfamiliarWords?.length || 0}</div>
      </div>
    )
  },
  {
    key: 'action',
    title: '操作',
    width: '13%',
    render: (_: any, record: Article) => (
      <div className="table-action-buttons">
        <ActionButton
          type="text"
          size="small"
          icon={<EyeOutlined />}
          tooltip="阅读"
          onClick={() => window.open(`/content/article/read/${record.id}`, '_blank')}
        />
        <ActionButton
          type="text"
          size="small"
          icon={<EditOutlined />}
          tooltip="编辑"
          onClick={() => window.open(`/content/article/edit/${record.id}`, '_blank')}
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
```

#### 步骤4：定义筛选选项

```typescript
// pages/content/Article/filters.ts
import { FilterOption } from '../../../types/list-page';

export const ArticleFilters: FilterOption[] = [
  {
    key: 'difficultyLevel',
    label: '难度',
    placeholder: '选择难度',
    options: [
      { value: 'easy', label: '初级' },
      { value: 'medium', label: '中级' },
      { value: 'hard', label: '高级' }
    ]
  },
  {
    key: 'hasAudio',
    label: '音频',
    placeholder: '是否有音频',
    options: [
      { value: true, label: '有音频' },
      { value: false, label: '无音频' }
    ]
  }
];
```

#### 步骤5：定义批量操作

```typescript
// pages/content/Article/batch-actions.tsx
import React from 'react';
import { BatchActionConfig } from '../../../types/list-page';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { batchDeleteArticles, exportArticles } from '../../../api/article';

export const ArticleBatchActions: BatchActionConfig[] = [
  {
    key: 'batchExport',
    label: '批量导出',
    icon: <ExportOutlined />,
    onClick: async (selectedIds: React.Key[]) => {
      try {
        await exportArticles(selectedIds as string[]);
        message.success('导出成功');
      } catch (error) {
        message.error('导出失败');
      }
    }
  },
  {
    key: 'batchDelete',
    label: '批量删除',
    icon: <DeleteOutlined />,
    danger: true,
    onClick: (selectedIds: React.Key[]) => {
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除选中的 ${selectedIds.length} 篇文章吗？`,
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            await batchDeleteArticles(selectedIds as string[]);
            message.success('批量删除成功');
            // 刷新页面数据
            window.location.reload();
          } catch (error) {
            message.error('批量删除失败');
          }
        }
      });
    }
  }
];
```

#### 步骤6：重构主页面组件

```typescript
// pages/content/Article/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UnifiedListPage } from '../../../components/UnifiedListPage';
import { PaginationConfig, SearchFilterValues } from '../../../types/list-page';
import { getAllArticles, deleteArticle } from '../../../api/article';
import { Article } from '../../../types';
import { articlePageConfig } from './config';
import { useNavigate } from 'react-router-dom';

const ArticleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilterValues>({});
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: articlePageConfig.pageSize || 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100']
  });

  // 获取数据
  const fetchData = useCallback(async (
    page = pagination.current,
    pageSize = pagination.pageSize,
    filters = searchFilters
  ) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        ...filters
      };
      
      const response = await getAllArticles(params);
      
      setArticles(response.data);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize,
        total: response.total
      }));
    } catch (error) {
      message.error('获取文章列表失败');
      console.error('Fetch articles error:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchFilters]);

  // 搜索处理
  const handleSearch = useCallback((values: SearchFilterValues) => {
    setSearchFilters(values);
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(1, pagination.pageSize, values);
  }, [pagination.pageSize, fetchData]);

  // 重置处理
  const handleReset = useCallback(() => {
    setSearchFilters({});
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(1, pagination.pageSize, {});
  }, [pagination.pageSize, fetchData]);

  // 删除处理
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteArticle(id);
      message.success('删除成功');
      
      // 如果当前页只有一条数据且不是第一页，则跳转到上一页
      const newPage = articles.length === 1 && pagination.current > 1 
        ? pagination.current - 1 
        : pagination.current;
      
      fetchData(newPage, pagination.pageSize, searchFilters);
    } catch (error) {
      message.error('删除失败');
      console.error('Delete article error:', error);
    }
  }, [articles.length, pagination.current, pagination.pageSize, searchFilters, fetchData]);

  // 分页处理
  const handlePageChange = useCallback((page: number, pageSize: number) => {
    fetchData(page, pageSize, searchFilters);
  }, [searchFilters, fetchData]);

  // 选择处理
  const handleSelectionChange = useCallback((keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  }, []);

  // 添加全局删除函数到window对象，供列配置使用
  useEffect(() => {
    (window as any).handleDelete = handleDelete;
    return () => {
      delete (window as any).handleDelete;
    };
  }, [handleDelete]);

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UnifiedListPage
      config={articlePageConfig}
      data={articles}
      loading={loading}
      pagination={pagination}
      selectedRowKeys={selectedRowKeys}
      onSearch={handleSearch}
      onReset={handleReset}
      onSelectionChange={handleSelectionChange}
      onPageChange={handlePageChange}
    >
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={() => navigate('/content/article/create')}
        size="large"
      >
        添加文章
      </Button>
    </UnifiedListPage>
  );
};

export default ArticleListPage;
```

### 4.2 WritingTopic页面迁移示例

#### 步骤1：分析现有实现

现有WritingTopic页面的关键特性：
- 搜索功能（主题标题、描述、标签）
- 难度级别筛选
- 主题类型筛选
- 批量删除
- 分页
- 操作按钮（查看、编辑、删除、使用）

#### 步骤2：配置页面参数

```typescript
// pages/practice/WritingTopic/config.ts
import { ListPageConfig } from '../../../types/list-page';
import { WritingTopicColumns } from './columns';
import { WritingTopicFilters } from './filters';
import { WritingTopicBatchActions } from './batch-actions';

export const writingTopicPageConfig: ListPageConfig = {
  title: '写作主题管理',
  columns: WritingTopicColumns,
  searchPlaceholder: '搜索主题标题、描述或标签',
  filterOptions: WritingTopicFilters,
  batchActions: WritingTopicBatchActions,
  enableSelection: true,
  pageSize: 12
};
```

#### 步骤3：定义表格列

```typescript
// pages/practice/WritingTopic/columns.tsx
import React from 'react';
import { ColumnConfig } from '../../../types/list-page';
import { ActionButton } from '../../../components/ActionButton';
import { StatusTag, difficultyStatusConfig, topicTypeStatusConfig } from '../../../components/StatusTag';
import { EyeOutlined, EditOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { WritingTopic } from '../../../types';

export const WritingTopicColumns: ColumnConfig[] = [
  {
    key: 'title',
    title: '主题标题',
    dataIndex: 'title',
    width: '25%',
    render: (text: string, record: WritingTopic) => (
      <a 
        className="table-link"
        onClick={() => window.open(`/practice/writing-topic/detail/${record.id}`, '_blank')}
      >
        {text}
      </a>
    )
  },
  {
    key: 'description',
    title: '描述',
    dataIndex: 'description',
    width: '30%',
    ellipsis: true,
    render: (text: string) => (
      <div className="table-ellipsis" title={text}>
        {text}
      </div>
    )
  },
  {
    key: 'type',
    title: '类型',
    dataIndex: 'type',
    width: '12%',
    render: (type: string) => (
      <StatusTag status={type} statusConfig={topicTypeStatusConfig} />
    )
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
    key: 'tags',
    title: '标签',
    dataIndex: 'tags',
    width: '15%',
    render: (tags: string[]) => (
      <div className="table-tags">
        {tags?.slice(0, 2).map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
        {tags?.length > 2 && <span className="tag-more">+{tags.length - 2}</span>}
      </div>
    )
  },
  {
    key: 'action',
    title: '操作',
    width: '8%',
    render: (_: any, record: WritingTopic) => (
      <div className="table-action-buttons">
        <ActionButton
          type="text"
          size="small"
          icon={<FormOutlined />}
          tooltip="开始写作"
          onClick={() => window.open(`/practice/writing/create?topicId=${record.id}`, '_blank')}
        />
        <ActionButton
          type="text"
          size="small"
          icon={<EyeOutlined />}
          tooltip="查看详情"
          onClick={() => window.open(`/practice/writing-topic/detail/${record.id}`, '_blank')}
        />
        <ActionButton
          type="text"
          size="small"
          icon={<EditOutlined />}
          tooltip="编辑"
          onClick={() => window.open(`/practice/writing-topic/edit/${record.id}`, '_blank')}
        />
        <ActionButton
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          tooltip="删除"
          confirmMessage="确定要删除这个写作主题吗？"
          onConfirm={() => handleDelete(record.id)}
        />
      </div>
    )
  }
];
```

#### 步骤4：定义筛选选项

```typescript
// pages/practice/WritingTopic/filters.ts
import { FilterOption } from '../../../types/list-page';

export const WritingTopicFilters: FilterOption[] = [
  {
    key: 'type',
    label: '主题类型',
    placeholder: '选择类型',
    options: [
      { value: 'argumentative', label: '议论文' },
      { value: 'narrative', label: '记叙文' },
      { value: 'descriptive', label: '描述文' },
      { value: 'expository', label: '说明文' }
    ]
  },
  {
    key: 'difficultyLevel',
    label: '难度',
    placeholder: '选择难度',
    options: [
      { value: 'easy', label: '初级' },
      { value: 'medium', label: '中级' },
      { value: 'hard', label: '高级' }
    ]
  }
];
```

#### 步骤5：定义批量操作

```typescript
// pages/practice/WritingTopic/batch-actions.tsx
import React from 'react';
import { BatchActionConfig } from '../../../types/list-page';
import { DeleteOutlined, ExportOutlined, CopyOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { batchDeleteTopics, exportTopics, duplicateTopics } from '../../../api/writing-topic';

export const WritingTopicBatchActions: BatchActionConfig[] = [
  {
    key: 'batchDuplicate',
    label: '批量复制',
    icon: <CopyOutlined />,
    action: async (selectedIds: string[]) => {
      try {
        await duplicateTopics(selectedIds);
        message.success(`成功复制 ${selectedIds.length} 个主题`);
        return true;
      } catch (error) {
        message.error('复制失败');
        return false;
      }
    }
  },
  {
    key: 'batchExport',
    label: '批量导出',
    icon: <ExportOutlined />,
    action: async (selectedIds: string[]) => {
      try {
        await exportTopics(selectedIds);
        message.success('导出成功');
        return true;
      } catch (error) {
        message.error('导出失败');
        return false;
      }
    }
  },
  {
    key: 'batchDelete',
    label: '批量删除',
    icon: <DeleteOutlined />,
    danger: true,
    confirmMessage: '确定要删除选中的主题吗？此操作不可恢复。',
    action: async (selectedIds: string[]) => {
      try {
        await batchDeleteTopics(selectedIds);
        message.success(`成功删除 ${selectedIds.length} 个主题`);
        return true;
      } catch (error) {
        message.error('删除失败');
        return false;
      }
    }
  }
];
```

### 4.3 WritingPractice页面迁移示例

#### 步骤1：分析现有实现

现有WritingPractice页面的关键特性：
- 搜索功能（标题、内容）
- 状态筛选（草稿、已提交、已评分）
- 主题筛选
- 批量删除
- 分页
- 操作按钮（查看、编辑、删除、提交）

#### 步骤2：配置页面参数

```typescript
// pages/practice/WritingPractice/config.ts
import { ListPageConfig } from '../../../types/list-page';
import { WritingPracticeColumns } from './columns';
import { WritingPracticeFilters } from './filters';
import { WritingPracticeBatchActions } from './batch-actions';

export const writingPracticePageConfig: ListPageConfig = {
  title: '写作练习',
  columns: WritingPracticeColumns,
  searchPlaceholder: '搜索练习标题或内容',
  filterOptions: WritingPracticeFilters,
  batchActions: WritingPracticeBatchActions,
  enableSelection: true,
  pageSize: 10
};
```

#### 步骤3：定义表格列

```typescript
// pages/practice/WritingPractice/columns.tsx
import React from 'react';
import { ColumnConfig } from '../../../types/list-page';
import { ActionButton } from '../../../components/ActionButton';
import { StatusTag, practiceStatusConfig } from '../../../components/StatusTag';
import { EyeOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { WritingPractice } from '../../../types';

export const WritingPracticeColumns: ColumnConfig[] = [
  {
    key: 'title',
    title: '练习标题',
    dataIndex: 'title',
    width: '20%',
    render: (text: string, record: WritingPractice) => (
      <a 
        className="table-link"
        onClick={() => window.open(`/practice/writing/detail/${record.id}`, '_blank')}
      >
        {text || '未命名练习'}
      </a>
    )
  },
  {
    key: 'topic',
    title: '写作主题',
    width: '18%',
    render: (_: any, record: WritingPractice) => (
      <div>
        <div style={{ fontWeight: 500 }}>{record.topic?.title}</div>
        <div style={{ color: '#666', fontSize: '12px' }}>{record.topic?.type}</div>
      </div>
    )
  },
  {
    key: 'content',
    title: '内容预览',
    dataIndex: 'content',
    width: '25%',
    ellipsis: true,
    render: (text: string) => (
      <div className="table-ellipsis" title={text}>
        {text || '暂无内容'}
      </div>
    )
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    width: '10%',
    render: (status: string) => (
      <StatusTag status={status} statusConfig={practiceStatusConfig} />
    )
  },
  {
    key: 'score',
    title: '评分',
    dataIndex: 'score',
    width: '8%',
    render: (score: number, record: WritingPractice) => (
      <div style={{ textAlign: 'center' }}>
        {record.status === 'graded' ? (
          <span style={{ color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f' }}>
            {score}
          </span>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )}
      </div>
    )
  },
  {
    key: 'createdAt',
    title: '创建时间',
    dataIndex: 'createdAt',
    width: '12%',
    sorter: (a: WritingPractice, b: WritingPractice) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  },
  {
    key: 'action',
    title: '操作',
    width: '7%',
    render: (_: any, record: WritingPractice) => (
      <div className="table-action-buttons">
        <ActionButton
          type="text"
          size="small"
          icon={<EyeOutlined />}
          tooltip="查看"
          onClick={() => window.open(`/practice/writing/detail/${record.id}`, '_blank')}
        />
        {record.status === 'draft' && (
          <ActionButton
            type="text"
            size="small"
            icon={<EditOutlined />}
            tooltip="编辑"
            onClick={() => window.open(`/practice/writing/edit/${record.id}`, '_blank')}
          />
        )}
        {record.status === 'draft' && (
          <ActionButton
            type="text"
            size="small"
            icon={<SendOutlined />}
            tooltip="提交"
            confirmMessage="确定要提交这篇写作练习吗？提交后将无法修改。"
            onConfirm={() => handleSubmit(record.id)}
          />
        )}
        <ActionButton
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          tooltip="删除"
          confirmMessage="确定要删除这篇写作练习吗？"
          onConfirm={() => handleDelete(record.id)}
        />
      </div>
    )
  }
];
```

#### 步骤4：定义筛选选项

```typescript
// pages/practice/WritingPractice/filters.ts
import { FilterOption } from '../../../types/list-page';

export const WritingPracticeFilters: FilterOption[] = [
  {
    key: 'status',
    label: '状态',
    placeholder: '选择状态',
    options: [
      { value: 'draft', label: '草稿' },
      { value: 'submitted', label: '已提交' },
      { value: 'graded', label: '已评分' }
    ]
  },
  {
    key: 'topicType',
    label: '主题类型',
    placeholder: '选择类型',
    options: [
      { value: 'argumentative', label: '议论文' },
      { value: 'narrative', label: '记叙文' },
      { value: 'descriptive', label: '描述文' },
      { value: 'expository', label: '说明文' }
    ]
  }
];
```

#### 步骤5：定义批量操作

```typescript
// pages/practice/WritingPractice/batch-actions.tsx
import React from 'react';
import { BatchActionConfig } from '../../../types/list-page';
import { DeleteOutlined, SendOutlined, DownloadOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { batchDeletePractices, batchSubmitPractices, exportPractices } from '../../../api/writing-practice';

export const WritingPracticeBatchActions: BatchActionConfig[] = [
  {
    key: 'batchSubmit',
    label: '批量提交',
    icon: <SendOutlined />,
    confirmMessage: '确定要提交选中的练习吗？提交后将无法修改。',
    action: async (selectedIds: string[]) => {
      try {
        await batchSubmitPractices(selectedIds);
        message.success(`成功提交 ${selectedIds.length} 篇练习`);
        return true;
      } catch (error) {
        message.error('提交失败');
        return false;
      }
    },
    disabled: (selectedRecords: any[]) => {
      // 只有草稿状态的练习才能提交
      return selectedRecords.some(record => record.status !== 'draft');
    }
  },
  {
    key: 'batchExport',
    label: '批量导出',
    icon: <DownloadOutlined />,
    action: async (selectedIds: string[]) => {
      try {
        await exportPractices(selectedIds);
        message.success('导出成功');
        return true;
      } catch (error) {
        message.error('导出失败');
        return false;
      }
    }
  },
  {
    key: 'batchDelete',
    label: '批量删除',
    icon: <DeleteOutlined />,
    danger: true,
    confirmMessage: '确定要删除选中的练习吗？此操作不可恢复。',
    action: async (selectedIds: string[]) => {
      try {
        await batchDeletePractices(selectedIds);
        message.success(`成功删除 ${selectedIds.length} 篇练习`);
        return true;
      } catch (error) {
        message.error('删除失败');
        return false;
      }
    }
  }
];
```

### 4.4 Word页面迁移

基于Article页面的迁移经验，Word页面的迁移相对简单：

1. **创建配置文件** `pages/vocabulary/Word/config.ts`
2. **定义列配置** `pages/vocabulary/Word/columns.tsx`
3. **定义筛选选项** `pages/vocabulary/Word/filters.ts`
4. **定义批量操作** `pages/vocabulary/Word/batch-actions.tsx`
5. **重构主组件** `pages/vocabulary/Word/index.tsx`

关键差异：
- Word页面有词性筛选
- 有音标显示
- 有例句展示
- 支持词汇本分类

### 4.3 其他页面迁移

按照相同的模式迁移其他页面，每个页面的特殊配置：

- **DictationPractice**: 状态筛选、分数显示
- **Sentence**: 关联文章显示
- **ListeningMaterial**: 音频播放控件
- **WordBook**: 词汇数量统计
- **PartOfSpeech**: 简单的增删改查

## 5. 测试策略

### 5.1 功能测试清单

#### 基础功能测试
- [ ] 页面加载正常
- [ ] 数据显示正确
- [ ] 搜索功能正常
- [ ] 筛选功能正常
- [ ] 分页功能正常
- [ ] 排序功能正常

#### 交互功能测试
- [ ] 行选择功能
- [ ] 批量操作功能
- [ ] 单行操作功能
- [ ] 表格滚动正常
- [ ] 响应式布局正常

#### 边界情况测试
- [ ] 空数据状态
- [ ] 加载状态
- [ ] 错误状态
- [ ] 网络异常处理
- [ ] 大数据量性能

### 5.2 自动化测试

#### 单元测试示例

```typescript
// __tests__/components/UnifiedListPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UnifiedListPage } from '../../../src/components/UnifiedListPage';
import { ListPageConfig } from '../../../src/types/list-page';

const mockConfig: ListPageConfig = {
  title: '测试页面',
  columns: [
    { key: 'name', title: '名称', dataIndex: 'name' },
    { key: 'status', title: '状态', dataIndex: 'status' }
  ],
  enableSelection: true
};

const mockData = [
  { id: '1', name: '测试1', status: 'active' },
  { id: '2', name: '测试2', status: 'inactive' }
];

const mockPagination = {
  current: 1,
  pageSize: 10,
  total: 2
};

describe('UnifiedListPage', () => {
  it('应该正确渲染页面标题', () => {
    render(
      <UnifiedListPage
        config={mockConfig}
        data={mockData}
        pagination={mockPagination}
        onPageChange={jest.fn()}
      />
    );
    
    expect(screen.getByText('测试页面')).toBeInTheDocument();
  });

  it('应该正确渲染表格数据', () => {
    render(
      <UnifiedListPage
        config={mockConfig}
        data={mockData}
        pagination={mockPagination}
        onPageChange={jest.fn()}
      />
    );
    
    expect(screen.getByText('测试1')).toBeInTheDocument();
    expect(screen.getByText('测试2')).toBeInTheDocument();
  });

  it('应该支持搜索功能', async () => {
    const onSearch = jest.fn();
    
    render(
      <UnifiedListPage
        config={{
          ...mockConfig,
          searchPlaceholder: '搜索测试'
        }}
        data={mockData}
        pagination={mockPagination}
        onSearch={onSearch}
        onPageChange={jest.fn()}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('搜索测试');
    fireEvent.change(searchInput, { target: { value: '测试关键词' } });
    
    const searchButton = screen.getByText('搜索');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith({
        searchText: '测试关键词'
      });
    });
  });
});
```

#### E2E测试示例

```typescript
// e2e/article-list.spec.ts
import { test, expect } from '@playwright/test';

test.describe('文章列表页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/content/article');
  });

  test('应该显示文章列表', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('文章管理');
    await expect(page.locator('.data-table')).toBeVisible();
  });

  test('应该支持搜索功能', async ({ page }) => {
    await page.fill('.search-input input', '测试文章');
    await page.click('button:has-text("搜索")');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.data-table tbody tr')).toHaveCount(1);
  });

  test('应该支持批量删除', async ({ page }) => {
    // 选择多行
    await page.click('.ant-checkbox-input');
    await page.click('tbody tr:first-child .ant-checkbox-input');
    await page.click('tbody tr:nth-child(2) .ant-checkbox-input');
    
    // 点击批量删除
    await page.click('button:has-text("批量删除")');
    
    // 确认删除
    await page.click('.ant-modal button:has-text("确定")');
    
    // 验证删除成功
    await expect(page.locator('.ant-message')).toContainText('批量删除成功');
  });
});
```

## 6. 性能优化

### 6.1 代码分割

```typescript
// 懒加载列表页面组件
const ArticleListPage = React.lazy(() => import('./pages/content/Article'));
const WordListPage = React.lazy(() => import('./pages/vocabulary/Word'));

// 路由配置
const routes = [
  {
    path: '/content/article',
    element: (
      <Suspense fallback={<PageLoading />}>
        <ArticleListPage />
      </Suspense>
    )
  }
];
```

### 6.2 虚拟滚动

对于大数据量场景，可以集成虚拟滚动：

```typescript
// components/VirtualTable.tsx
import { FixedSizeList as List } from 'react-window';

const VirtualTable: React.FC<VirtualTableProps> = ({ data, columns, height = 400 }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {/* 渲染表格行 */}
    </div>
  );

  return (
    <List
      height={height}
      itemCount={data.length}
      itemSize={50}
    >
      {Row}
    </List>
  );
};
```

### 6.3 缓存策略

```typescript
// hooks/useListData.ts
import { useQuery } from 'react-query';

export const useListData = (key: string, fetcher: Function, options = {}) => {
  return useQuery(
    [key, options],
    () => fetcher(options),
    {
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
      refetchOnWindowFocus: false
    }
  );
};
```

## 7. 故障排除

### 7.1 常见问题

#### 问题1：样式不生效

**症状**：页面显示但样式混乱

**解决方案**：
1. 检查CSS文件是否正确导入
2. 检查CSS变量是否定义
3. 检查Ant Design主题配置

```typescript
// 确保在入口文件中导入样式
import './components/UnifiedListPage/style.css';
import 'antd/dist/antd.css';
```

#### 问题2：表格数据不显示

**症状**：表格结构正常但无数据

**解决方案**：
1. 检查数据格式是否正确
2. 检查rowKey配置
3. 检查列配置的dataIndex

```typescript
// 确保数据有正确的id字段
const data = articles.map(article => ({
  ...article,
  key: article.id // 或者在Table组件中设置rowKey="id"
}));
```

#### 问题3：搜索功能异常

**症状**：搜索无响应或结果错误

**解决方案**：
1. 检查搜索参数传递
2. 检查API接口
3. 检查防抖处理

```typescript
// 添加防抖处理
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((values: SearchFilterValues) => {
    handleSearch(values);
  }, 300),
  [handleSearch]
);
```

### 7.2 调试技巧

1. **使用React DevTools**检查组件状态
2. **使用Network面板**检查API请求
3. **使用Console**查看错误信息
4. **使用Performance面板**分析性能问题

## 8. 最佳实践

### 8.1 代码组织

1. **按功能模块组织代码**
2. **使用TypeScript严格模式**
3. **统一命名规范**
4. **添加详细注释**

### 8.2 性能优化

1. **使用React.memo避免不必要的重渲染**
2. **使用useCallback和useMemo缓存计算结果**
3. **合理使用懒加载**
4. **优化图片和资源加载**

### 8.3 用户体验

1. **提供清晰的加载状态**
2. **友好的错误提示**
3. **响应式设计**
4. **无障碍访问支持**

### 8.4 维护性

1. **编写单元测试**
2. **文档完善**
3. **代码审查**
4. **定期重构**

## 9. 验收标准

### 9.1 功能完整性

- [ ] 所有原有功能正常工作
- [ ] 新增功能按预期工作
- [ ] 无功能回归问题

### 9.2 视觉一致性

- [ ] 所有页面使用统一的设计语言
- [ ] 响应式布局正常
- [ ] 交互动画流畅

### 9.3 性能指标

- [ ] 页面加载时间 < 2秒
- [ ] 交互响应时间 < 100ms
- [ ] 内存使用合理

### 9.4 代码质量

- [ ] TypeScript类型覆盖率 > 90%
- [ ] 单元测试覆盖率 > 80%
- [ ] ESLint检查通过
- [ ] 代码审查通过

## 10. 后续维护

### 10.1 监控和反馈

1. **设置错误监控**（如Sentry）
2. **收集用户反馈**
3. **定期性能检查**
4. **持续优化改进**

### 10.2 版本管理

1. **语义化版本控制**
2. **变更日志维护**
3. **向后兼容性考虑**
4. **平滑升级策略**

通过遵循本迁移指南，可以确保列表页面迁移的顺利进行，并建立一个可维护、可扩展的统一设计系统。