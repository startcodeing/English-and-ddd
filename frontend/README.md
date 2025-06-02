# 英语学习平台前端

这是英语学习平台的前端项目，基于React、TypeScript和Ant Design构建。

## 项目结构

```
src/
├── api/            # API请求
├── assets/         # 静态资源
├── components/     # 通用组件
├── config/         # 配置文件
├── hooks/          # 自定义Hooks
├── layouts/        # 布局组件
├── locales/        # 国际化资源
├── pages/          # 页面组件
├── routes/         # 路由配置
├── services/       # 服务
├── store/          # Redux状态管理
├── types/          # TypeScript类型定义
├── utils/          # 工具函数
└── App.tsx         # 应用入口
```

## 功能模块

1. 词性管理 - 管理英语中的所有词性
2. 单词管理 - 管理英语单词
3. 单词本管理 - 管理单词本
4. 句子管理 - 管理英语句子
5. 文章管理 - 管理英语文章
6. 听写模块 - 进行听写练习
7. 写作模块 - 进行写作练习
8. 综合测试 - 进行综合测试

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 技术栈

- React 19
- TypeScript
- React Router
- Redux Toolkit
- Ant Design
- Axios
- i18next
