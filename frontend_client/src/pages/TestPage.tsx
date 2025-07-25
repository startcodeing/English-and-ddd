import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Target, 
  Award, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Star, 
  TrendingUp,
  BookOpen,
  Headphones,
  PenTool,
  FileText,
  Calendar,
  Filter
} from 'lucide-react';
import { Test, TestResult } from '../types';

const TestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'history' | 'analysis'>('available');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'writing'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // 模拟可用测试数据
  const mockTests: Test[] = [
    {
      id: '1',
      title: '四级词汇测试',
      description: '测试你的四级词汇掌握程度，包含200个核心词汇',
      type: 'vocabulary',
      difficulty: 'medium',
      duration: 30,
      questionCount: 50,
      category: 'vocabulary',
      tags: ['四级', '词汇', '选择题'],
      estimatedScore: 85,
      completionRate: 78
    },
    {
      id: '2',
      title: '语法综合测试',
      description: '涵盖时态、语态、从句等重要语法点',
      type: 'grammar',
      difficulty: 'hard',
      duration: 45,
      questionCount: 40,
      category: 'grammar',
      tags: ['语法', '时态', '从句'],
      estimatedScore: 72,
      completionRate: 65
    },
    {
      id: '3',
      title: '听力理解测试',
      description: '包含对话、短文和新闻听力材料',
      type: 'listening',
      difficulty: 'medium',
      duration: 25,
      questionCount: 30,
      category: 'listening',
      tags: ['听力', '对话', '短文'],
      estimatedScore: 80,
      completionRate: 82
    },
    {
      id: '4',
      title: '阅读理解专项',
      description: '多篇文章阅读理解，提升阅读技能',
      type: 'reading',
      difficulty: 'medium',
      duration: 60,
      questionCount: 25,
      category: 'reading',
      tags: ['阅读', '理解', '文章'],
      estimatedScore: 88,
      completionRate: 90
    },
    {
      id: '5',
      title: '写作能力评估',
      description: '议论文写作，测试你的英语表达能力',
      type: 'writing',
      difficulty: 'hard',
      duration: 90,
      questionCount: 3,
      category: 'writing',
      tags: ['写作', '议论文', '表达'],
      estimatedScore: 75,
      completionRate: 45
    },
    {
      id: '6',
      title: '模拟考试（四级）',
      description: '完整的四级模拟考试，包含所有题型',
      type: 'comprehensive',
      difficulty: 'hard',
      duration: 120,
      questionCount: 100,
      category: 'comprehensive',
      tags: ['四级', '模拟', '综合'],
      estimatedScore: 82,
      completionRate: 35
    }
  ];

  // 模拟测试历史数据
  const mockTestHistory: TestResult[] = [
    {
      id: '1',
      testId: '1',
      testTitle: '四级词汇测试',
      score: 88,
      totalQuestions: 50,
      correctAnswers: 44,
      completedAt: '2024-01-15T10:30:00Z',
      duration: 28,
      category: 'vocabulary',
      difficulty: 'medium'
    },
    {
      id: '2',
      testId: '3',
      testTitle: '听力理解测试',
      score: 76,
      totalQuestions: 30,
      correctAnswers: 23,
      completedAt: '2024-01-14T14:20:00Z',
      duration: 25,
      category: 'listening',
      difficulty: 'medium'
    },
    {
      id: '3',
      testId: '2',
      testTitle: '语法综合测试',
      score: 68,
      totalQuestions: 40,
      correctAnswers: 27,
      completedAt: '2024-01-13T16:45:00Z',
      duration: 42,
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: '4',
      testId: '4',
      testTitle: '阅读理解专项',
      score: 92,
      totalQuestions: 25,
      correctAnswers: 23,
      completedAt: '2024-01-12T09:15:00Z',
      duration: 55,
      category: 'reading',
      difficulty: 'medium'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return <BookOpen className="h-5 w-5" />;
      case 'grammar':
        return <FileText className="h-5 w-5" />;
      case 'listening':
        return <Headphones className="h-5 w-5" />;
      case 'reading':
        return <BookOpen className="h-5 w-5" />;
      case 'writing':
        return <PenTool className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return 'bg-blue-100 text-blue-800';
      case 'grammar':
        return 'bg-green-100 text-green-800';
      case 'listening':
        return 'bg-orange-100 text-orange-800';
      case 'reading':
        return 'bg-purple-100 text-purple-800';
      case 'writing':
        return 'bg-pink-100 text-pink-800';
      case 'comprehensive':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return '词汇';
      case 'grammar':
        return '语法';
      case 'listening':
        return '听力';
      case 'reading':
        return '阅读';
      case 'writing':
        return '写作';
      case 'comprehensive':
        return '综合';
      default:
        return '未知';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredTests = mockTests.filter(test => {
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const filteredHistory = mockTestHistory.filter(result => {
    const matchesCategory = selectedCategory === 'all' || result.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || result.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const AvailableTestsTab = () => (
    <div className="space-y-6">
      {/* 推荐测试 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">为你推荐</h2>
        <p className="text-blue-100 mb-4">基于你的学习进度，我们推荐以下测试</p>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">四级词汇测试</h3>
              <p className="text-sm text-blue-100">预计得分：85分 | 30分钟</p>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              开始测试
            </button>
          </div>
        </div>
      </div>

      {/* 测试列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`p-2 rounded-lg ${getCategoryColor(test.category)}`}>
                  {getCategoryIcon(test.category)}
                </span>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(test.category)}`}>
                    {getCategoryText(test.category)}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                {getDifficultyText(test.difficulty)}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {test.duration} 分钟
                </span>
                <span className="flex items-center text-gray-500">
                  <Target className="h-4 w-4 mr-1" />
                  {test.questionCount} 题
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">预计得分</span>
                <span className={`font-medium ${getScoreColor(test.estimatedScore)}`}>
                  {test.estimatedScore}分
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">完成率</span>
                <span className="font-medium text-gray-700">{test.completionRate}%</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 mb-4">
              {test.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
              <Play className="h-4 w-4 mr-2" />
              开始测试
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const TestHistoryTab = () => (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-blue-600">总测试次数</p>
              <p className="text-2xl font-bold text-blue-700">{mockTestHistory.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-green-600">平均分数</p>
              <p className="text-2xl font-bold text-green-700">
                {Math.round(mockTestHistory.reduce((sum, result) => sum + result.score, 0) / mockTestHistory.length)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-purple-600">最高分数</p>
              <p className="text-2xl font-bold text-purple-700">
                {Math.max(...mockTestHistory.map(r => r.score))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-orange-600">正确率</p>
              <p className="text-2xl font-bold text-orange-700">
                {Math.round(
                  (mockTestHistory.reduce((sum, result) => sum + result.correctAnswers, 0) /
                   mockTestHistory.reduce((sum, result) => sum + result.totalQuestions, 0)) * 100
                )}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 测试历史列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">测试历史</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredHistory.map((result) => (
            <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`p-2 rounded-lg ${getCategoryColor(result.category)}`}>
                      {getCategoryIcon(result.category)}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{result.testTitle}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(result.completedAt).toLocaleDateString('zh-CN')}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {result.duration} 分钟
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                          {getCategoryText(result.category)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result.difficulty)}`}>
                          {getDifficultyText(result.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">得分</p>
                      <p className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}分
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">正确率</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">答题情况</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.correctAnswers}/{result.totalQuestions}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-6">
                  <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    查看详情
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    重新测试
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AnalysisTab = () => (
    <div className="space-y-6">
      {/* 能力雷达图 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">能力分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">各项能力得分</h3>
            <div className="space-y-4">
              {[
                { name: '词汇', score: 85, color: 'bg-blue-500' },
                { name: '语法', score: 72, color: 'bg-green-500' },
                { name: '听力', score: 78, color: 'bg-orange-500' },
                { name: '阅读', score: 90, color: 'bg-purple-500' },
                { name: '写作', score: 68, color: 'bg-pink-500' }
              ].map((skill) => (
                <div key={skill.name} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">{skill.name}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${skill.color} transition-all duration-300`}
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900">{skill.score}分</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">进步趋势</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-green-800">阅读理解</span>
                </div>
                <span className="text-sm text-green-600">+12分</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800">词汇掌握</span>
                </div>
                <span className="text-sm text-blue-600">+8分</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-orange-800">听力理解</span>
                </div>
                <span className="text-sm text-orange-600">+5分</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 薄弱环节分析 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">薄弱环节分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">需要加强的领域</h3>
            <div className="space-y-3">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-800">写作表达</span>
                  <span className="text-sm text-red-600">68分</span>
                </div>
                <p className="text-sm text-red-700">语法错误较多，建议加强语法练习</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-800">语法应用</span>
                  <span className="text-sm text-yellow-600">72分</span>
                </div>
                <p className="text-sm text-yellow-700">时态和语态使用不够准确</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">学习建议</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">每日写作练习</p>
                  <p className="text-xs text-blue-600">建议每天完成一篇短文写作</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">语法专项训练</p>
                  <p className="text-xs text-green-600">重点练习时态和语态转换</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">定期模拟测试</p>
                  <p className="text-xs text-purple-600">每周进行一次综合测试</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学习目标设定 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">学习目标</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">短期目标（1个月）</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 写作能力提升到75分</li>
              <li>• 语法测试达到80分</li>
              <li>• 完成10次模拟测试</li>
            </ul>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">中期目标（3个月）</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 各项能力均达到80分以上</li>
              <li>• 四级模拟考试达到85分</li>
              <li>• 掌握2000个核心词汇</li>
            </ul>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">长期目标（6个月）</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 通过英语四级考试</li>
              <li>• 综合能力达到90分</li>
              <li>• 开始六级备考</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">测试评估</h1>
        <p className="text-gray-600">通过测试了解你的英语水平，发现学习薄弱环节</p>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'available'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Play className="h-5 w-5 inline mr-2" />
            可用测试
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="h-5 w-5 inline mr-2" />
            测试历史
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-5 w-5 inline mr-2" />
            能力分析
          </button>
        </nav>
      </div>

      {/* 筛选器 */}
      {(activeTab === 'available' || activeTab === 'history') && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部类型</option>
              <option value="vocabulary">词汇</option>
              <option value="grammar">语法</option>
              <option value="listening">听力</option>
              <option value="reading">阅读</option>
              <option value="writing">写作</option>
              <option value="comprehensive">综合</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
        </div>
      )}

      {/* 标签页内容 */}
      {activeTab === 'available' && <AvailableTestsTab />}
      {activeTab === 'history' && <TestHistoryTab />}
      {activeTab === 'analysis' && <AnalysisTab />}
    </div>
  );
};

export default TestPage;