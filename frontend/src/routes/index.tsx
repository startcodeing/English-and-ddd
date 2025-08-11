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
const ArticleForm = React.lazy(() => import('../pages/content/Article/ArticleFormPage'));
const WritingTopicList = React.lazy(() => import('../pages/content/WritingTopicListPage'));
const WritingTopicForm = React.lazy(() => import('../pages/content/WritingTopicFormPage'));
const WritingTopicDetail = React.lazy(() => import('../pages/content/WritingTopicDetailPage'));
const ListeningMaterialList = React.lazy(() => import('../pages/content/ListeningMaterial/ListeningMaterialListPage'));
const ListeningMaterialForm = React.lazy(() => import('../pages/content/ListeningMaterial/ListeningMaterialFormPage'));
const ListeningMaterialDetail = React.lazy(() => import('../pages/content/ListeningMaterial/ListeningMaterialDetailPage'));
const ListeningMaterialPlayer = React.lazy(() => import('../pages/content/ListeningMaterial/ListeningMaterialPlayerPage'));
const GrammarAnalysisListPage = React.lazy(() => import('../pages/content/GrammarAnalysis/GrammarAnalysisListPage'));
const GrammarAnalysisFormPage = React.lazy(() => import('../pages/content/GrammarAnalysis/GrammarAnalysisFormPage'));

// 练习模块页面
const Dictation = React.lazy(() => import('../pages/practice/dictation'));
const DictationPracticeListPage = React.lazy(() => import('../pages/practice/dictation/DictationPracticeListPage'));
const DictationPracticeFormPage = React.lazy(() => import('../pages/practice/dictation/DictationPracticeFormPage'));
const DictationPracticeViewPage = React.lazy(() => import('../pages/practice/dictation/DictationPracticeViewPage'));
const Writing = React.lazy(() => import('../pages/practice/writing'));
const WritingPracticeList = React.lazy(() => import('../pages/practice/writing/WritingPracticeListPage'));
const WritingPracticeForm = React.lazy(() => import('../pages/practice/writing/WritingPracticeFormPage'));
const WritingPracticeView = React.lazy(() => import('../pages/practice/writing/WritingPracticeViewPage'));

// 测试模块页面
const Comprehensive = React.lazy(() => import('../pages/test/comprehensive'));

// 用户相关页面
const UserActivity = React.lazy(() => import('../pages/user/UserActivityPage'));
const ProfilePage = React.lazy(() => import('../pages/user/ProfilePage'));

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
      {        
        path: '/content/article/read/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ArticleReader />
          </React.Suspense>
        ),
      },
      {
        path: '/content/article/create',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ArticleForm />
          </React.Suspense>
        ),
      },
      {
        path: '/content/article/edit/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ArticleForm />
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
      {
        path: '/content/writing-topics',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WritingTopicList />
          </React.Suspense>
        ),
      },
      {
        path: '/content/writing-topics/create',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WritingTopicForm />
          </React.Suspense>
        ),
      },
      {
        path: '/content/writing-topics/edit/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WritingTopicForm />
          </React.Suspense>
        ),
      },
      {
        path: '/content/writing-topics/detail/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WritingTopicDetail />
          </React.Suspense>
        ),
      },
      {
        path: '/content/grammar-analysis',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <GrammarAnalysisListPage />
          </React.Suspense>
        ),
      },
      {
        path: '/content/grammar-analysis/new',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <GrammarAnalysisFormPage />
          </React.Suspense>
        ),
      },
      {
        path: '/content/grammar-analysis/edit/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <GrammarAnalysisFormPage />
          </React.Suspense>
        ),
      },
      {
        path: '/content/listening-materials/page',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ListeningMaterialList />
          </React.Suspense>
        ),
      },
      {
        path: '/content/listening-materials/create',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ListeningMaterialForm />
          </React.Suspense>
        ),
      },
      {
        path: '/content/listening-materials/edit/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ListeningMaterialForm />
          </React.Suspense>
        ),
      },
      {        path: '/content/listening-materials/detail/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ListeningMaterialDetail />
          </React.Suspense>
        ),
      },
      {
        path: '/content/listening-materials/player/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ListeningMaterialPlayer />
          </React.Suspense>
        ),
      },
      // 练习模块路由
      {
        path: '/practice/dictation',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <DictationPracticeListPage />
          </React.Suspense>
        ),
      },
      {
        path: '/practice/dictation/create',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <DictationPracticeFormPage />
          </React.Suspense>
        ),
      },
      {
        path: '/practice/dictation/edit/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <DictationPracticeFormPage />
          </React.Suspense>
        ),
      },
      {
        path: '/practice/dictation/view/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <DictationPracticeViewPage />
          </React.Suspense>
        ),
      },
      {
        path: '/practice/writing',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WritingPracticeList />
          </React.Suspense>
        ),
      },
      {
        path: '/practice/writing/create',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WritingPracticeForm />
          </React.Suspense>
        ),
      },
      {        path: '/practice/writing/edit/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WritingPracticeForm />
          </React.Suspense>
        ),
      },
      {
        path: '/practice/writing/view/:id',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <WritingPracticeView />
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
      {
        path: '/profile',
        element: (
          <React.Suspense fallback={<LoadingComponent />}>
            <ProfilePage />
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