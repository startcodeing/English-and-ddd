import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  Calendar,
  Play,
  Star,
  ChevronRight
} from 'lucide-react';
import { useUserStore, useStudyStore, initializeMockData } from '../store';

const HomePage: React.FC = () => {
  const { user } = useUserStore();
  const { dailyRecommendation, studyStats } = useStudyStore();

  useEffect(() => {
    // 初始化模拟数据
    initializeMockData();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              欢迎回来，{user?.username || '学习者'}！
            </h1>
            <p className="text-blue-100 mb-4">
              今天是你连续学习的第 {user?.continuousStudyDays || 0} 天，继续保持！
            </p>
            <Link
              to="/study"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Play className="mr-2 h-5 w-5" />
              开始今日学习
            </Link>
          </div>
          <div className="hidden md:block">
            <img
              src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=student%20studying%20english%20books%20illustration%20modern%20style&image_size=square"
              alt="学习插图"
              className="w-32 h-32 rounded-lg object-cover"
            />
          </div>
        </div>
      </div>

      {/* 学习统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今日学习时长</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor((studyStats?.todayStudyTime || 0) / 60)}分钟
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已学单词</p>
              <p className="text-2xl font-bold text-gray-900">{user?.totalWords || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">连续学习</p>
              <p className="text-2xl font-bold text-gray-900">{user?.continuousStudyDays || 0}天</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">当前等级</p>
              <p className="text-2xl font-bold text-gray-900">Level {user?.level || 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 今日推荐内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 推荐单词 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">今日推荐单词</h2>
              <Link 
                to="/study/vocabulary" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                查看更多
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {dailyRecommendation?.words.slice(0, 2).map((word) => (
              <div key={word.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{word.word}</h3>
                    <p className="text-sm text-gray-500">{word.pronunciation}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                    {getDifficultyText(word.difficulty)}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{word.meaning}</p>
                <p className="text-sm text-gray-600 italic">{word.example}</p>
                <div className="mt-3 flex items-center space-x-2">
                  <button className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm">
                    <Play className="mr-1 h-3 w-3" />
                    发音
                  </button>
                  <button className="flex items-center px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-sm">
                    <Star className="mr-1 h-3 w-3" />
                    收藏
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 推荐文章 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">今日推荐阅读</h2>
              <Link 
                to="/study/reading" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                查看更多
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {dailyRecommendation?.articles.slice(0, 1).map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">{article.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                    {getDifficultyText(article.difficulty)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-3">{article.summary}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {article.readingTime} 分钟
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">{article.category}</span>
                  </div>
                  <Link 
                    to={`/study/reading/${article.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    开始阅读
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 学习进度和快速入口 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 本周学习进度 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">本周学习进度</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {studyStats?.weeklyProgress.map((day, index) => (
                <div key={day.date} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((day.studyTime / 3600) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-sm text-gray-900 text-right">
                    {Math.floor(day.studyTime / 60)}分钟
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 快速入口 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">快速入口</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link
              to="/study/vocabulary"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-blue-500 mr-3" />
              <span className="font-medium text-gray-900">词汇学习</span>
            </Link>
            <Link
              to="/study/listening"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Play className="h-5 w-5 text-green-500 mr-3" />
              <span className="font-medium text-gray-900">听力训练</span>
            </Link>
            <Link
              to="/test"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Target className="h-5 w-5 text-purple-500 mr-3" />
              <span className="font-medium text-gray-900">能力测试</span>
            </Link>
            <Link
              to="/plan"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-orange-500 mr-3" />
              <span className="font-medium text-gray-900">学习计划</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;