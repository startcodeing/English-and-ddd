import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// 懒加载页面组件
const Dashboard = React.lazy(() => import('../pages/dashboard'));

// 词汇管理页面
const PartOfSpeech = React.lazy(() => import('../pages/vocabulary/PartOfSpeech'));
const Word = React.lazy(() => import('../pages/vocabulary/Word'));
const WordBook = React.lazy(() => import('../pages/vocabulary/WordBook'));

// 内容管理页面
const Sentence = React.lazy(() => import('../pages/content/Sentence'));
const Article = React.lazy(() => import('../pages/content/Article'));
const ArticleReader = React.lazy(() => import('../pages/content/ArticleReader'));
const SentenceReader = React.lazy(() => import('../pages/content/SentenceReader'));

// 练习模块页面
const Dictation = React.lazy(() => import('../pages/practice/dictation'));
const Writing = React.lazy(() => import('../pages/practice/writing'));

// 测试模块页面
const Comprehensive = React.lazy(() => import('../pages/test/comprehensive'));

// 用户相关页面
const UserActivity = React.lazy(() => import('../pages/user/UserActivityPage'));

// 认证页面
const Login = React.lazy(() => import('../pages/auth/Login'));
// 注意：Register组件尚未实现，使用Login组件临时占位
const Register = React.lazy(() => import('../pages/auth/Login')); // 临时占位

// 错误页面
const NotFound = React.lazy(() => import('../pages/error/404'));
const ServerError = React.lazy(() => import('../pages/error/500'));

// 加载中组件
const LoadingComponent = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%', 
    fontSize: '16px' 
  }}>
    加载中...
  </div>
);

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <Dashboard />
          </React.Suspense>
        ),
      },
      // 词汇管理路由
      {
        path: '/vocabulary/part-of-speech',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <PartOfSpeech />
          </React.Suspense>
        ),
      },
      {
        path: '/vocabulary/word',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <Word />
          </React.Suspense>
        ),
      },

      {
        path: '/vocabulary/word-book',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WordBook />
          </React.Suspense>
        ),
      },
      // 内容管理路由
      {
        path: '/content/sentence',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <Sentence />
          </React.Suspense>
        ),
      },
      {
        path: '/content/article',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <Article />
          </React.Suspense>
        ),
      },
      {        path: '/content/article/read/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ArticleReader />
          </React.Suspense>
        ),
      },
      {
        path: '/content/sentence/read/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <SentenceReader />
          </React.Suspense>
        ),
      },
      // 练习模块路由
      {
        path: '/practice/dictation',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <Dictation />
          </React.Suspense>
        ),
      },
      {
        path: '/practice/writing',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <Writing />
          </React.Suspense>
        ),
      },
      // 测试模块路由
      {
        path: '/test/comprehensive',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <Comprehensive />
          </React.Suspense>
        ),
      },
      // 用户相关路由
      {
        path: '/user/activities',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <UserActivity />
          </React.Suspense>
        ),
      },
      // 错误页面路由
      {
        path: '*',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <NotFound />
          </React.Suspense>
        ),
      },
    ],
  },
  // 认证路由（不使用主布局）
  {
    path: '/auth/login',
    element: (
      <React.Suspense fallback={<LoadingComponent />}>
        <Login />
      </React.Suspense>
    ),
  },
  {
    path: '/auth/register',
    element: (
      <React.Suspense fallback={<LoadingComponent />}>
        <Register />
      </React.Suspense>
    ),
  },
  // 服务器错误页面（不使用主布局）
  {
    path: '/error/500',
    element: (
      <React.Suspense fallback={<LoadingComponent />}>
        <ServerError />
      </React.Suspense>
    ),
  },
]);

export default router;