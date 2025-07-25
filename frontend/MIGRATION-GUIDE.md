# 从 Create React App 迁移到 Vite 指南

## 迁移概述

本项目已从 Create React App (CRA) 迁移到 Vite 构建工具。Vite 提供了更快的开发服务器启动时间和热更新速度，以及更现代化的构建配置。

## 主要变更

1. **项目入口文件**：
   - 新增 `index.html` 作为应用入口（位于项目根目录）
   - 新增 `src/main.tsx` 替代原有的 `src/index.tsx`

2. **环境变量**：
   - 环境变量前缀从 `REACT_APP_` 改为 `VITE_`
   - 访问方式从 `process.env.REACT_APP_XXX` 改为 `import.meta.env.VITE_XXX`
   - 已创建 `.env.local` 文件，包含所有必要的环境变量

3. **配置文件**：
   - 新增 `vite.config.ts` 替代 CRA 和 craco 配置
   - 更新 `tsconfig.json` 以适配 Vite
   - 新增 `tsconfig.node.json` 用于 Vite 配置文件

4. **依赖变更**：
   - 移除 `react-scripts`、`@craco/craco` 等 CRA 相关依赖
   - 添加 `vite`、`@vitejs/plugin-react` 等 Vite 相关依赖

5. **脚本命令**：
   - `npm start` → `npm run dev`
   - `npm run build` → `npm run build` (功能相同但使用 Vite 构建)

## 如何启动项目

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 构建生产版本：

```bash
npm run build
```

4. 预览生产构建：

```bash
npm run preview
```

## 常见问题

### 1. 环境变量不生效

确保所有环境变量都以 `VITE_` 开头，并在 `.env`、`.env.local`、`.env.development` 或 `.env.production` 文件中定义。

### 2. 静态资源路径问题

Vite 处理静态资源的方式与 CRA 不同：

- CRA: `%PUBLIC_URL%/asset.png` 或 `process.env.PUBLIC_URL + '/asset.png'`
- Vite: `/asset.png` 或 `import.meta.env.BASE_URL + 'asset.png'`

### 3. 代理配置

代理配置已在 `vite.config.ts` 中设置，替代了原有的 `setupProxy.js`。

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  },
},
```

### 4. 类型定义

已添加 `src/vite-env.d.ts` 文件，提供 Vite 环境变量的类型定义。

## 参考资源

- [Vite 官方文档](https://vitejs.dev/)
- [从 Create React App 迁移](https://vitejs.dev/guide/migration-from-cra.html)