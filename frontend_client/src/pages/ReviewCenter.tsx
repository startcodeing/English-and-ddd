import React, { useState } from 'react';
import { 
  BookOpen, 
  Heart, 
  RotateCcw, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle, 
  Star, 
  Filter,
  Search,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { WrongQuestion, FavoriteContent } from '../types';

const ReviewCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wrong' | 'favorites' | 'review'>('wrong');
  const [filterType, setFilterType] = useState<'all' | 'word' | 'sentence' | 'article' | 'listening'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟错题本数据
  const mockWrongQuestions: WrongQuestion[] = [
    {
      id: '1',
      type: 'word',
      question: 'The meaning of "elaborate" is:',
      userAnswer: 'simple',
      correctAnswer: 'detailed and complicated',
      explanation: 'Elaborate means involving many carefully arranged parts or details; detailed and complicated in design and planning.',
      wrongCount: 3,
      lastReviewDate: '2024-01-15',
      isResolved: false,
      difficulty: 'medium',
      tags: ['vocabulary', 'adjective']
    },
    {
      id: '2',
      type: 'sentence',
      question: 'Choose the correct sentence:',
      userAnswer: 'He don\'t like apples.',
      correctAnswer: 'He doesn\'t like apples.',
      explanation: 'When using third person singular (he, she, it), we use "doesn\'t" not "don\'t".',
      wrongCount: 2,
      lastReviewDate: '2024-01-14',
      isResolved: true,
      difficulty: 'easy',
      tags: ['grammar', 'present tense']
    },
    {
      id: '3',
      type: 'listening',
      question: 'What did the speaker say about the weather?',
      userAnswer: 'It will be sunny',
      correctAnswer: 'It will be rainy',
      explanation: 'The speaker mentioned "bring an umbrella" which indicates rainy weather.',
      wrongCount: 1,
      lastReviewDate: '2024-01-13',
      isResolved: false,
      difficulty: 'hard',
      tags: ['listening', 'weather']
    }
  ];

  // 模拟收藏内容数据
  const mockFavorites: FavoriteContent[] = [
    {
      id: '1',
      type: 'word',
      title: 'Sophisticated',
      content: 'Having great knowledge or experience; complex and refined',
      source: '四级词汇',
      addedDate: '2024-01-15',
      tags: ['vocabulary', 'advanced'],
      notes: 'Often used to describe people, systems, or ideas that are complex and refined.'
    },
    {
      id: '2',
      type: 'sentence',
      title: 'Conditional Sentences',
      content: 'If I had studied harder, I would have passed the exam.',
      source: '语法练习',
      addedDate: '2024-01-14',
      tags: ['grammar', 'conditional'],
      notes: 'Third conditional - used for hypothetical past situations.'
    },
    {
      id: '3',
      type: 'article',
      title: 'Climate Change Effects',
      content: 'Climate change is affecting global weather patterns...',
      source: '阅读理解',
      addedDate: '2024-01-13',
      tags: ['reading', 'environment'],
      notes: 'Important article about environmental issues.'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'word':
        return 'bg-blue-100 text-blue-800';
      case 'sentence':
        return 'bg-green-100 text-green-800';
      case 'article':
        return 'bg-purple-100 text-purple-800';
      case 'listening':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'word':
        return '单词';
      case 'sentence':
        return '句子';
      case 'article':
        return '文章';
      case 'listening':
        return '听力';
      default:
        return '未知';
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

  const filteredWrongQuestions = mockWrongQuestions.filter(q => {
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const filteredFavorites = mockFavorites.filter(f => {
    const matchesType = filterType === 'all' || f.type === filterType;
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const WrongQuestionsTab = () => (
    <div className="space-y-4">
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-red-600">总错题数</p>
              <p className="text-2xl font-bold text-red-700">{mockWrongQuestions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-yellow-600">待复习</p>
              <p className="text-2xl font-bold text-yellow-700">
                {mockWrongQuestions.filter(q => !q.isResolved).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-green-600">已掌握</p>
              <p className="text-2xl font-bold text-green-700">
                {mockWrongQuestions.filter(q => q.isResolved).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-blue-600">正确率</p>
              <p className="text-2xl font-bold text-blue-700">75%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 错题列表 */}
      <div className="space-y-4">
        {filteredWrongQuestions.map((question) => (
          <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                  {getTypeText(question.type)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                  {getDifficultyText(question.difficulty)}
                </span>
                {question.isResolved && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    已掌握
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <RotateCcw className="h-4 w-4 mr-1" />
                错误 {question.wrongCount} 次
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900 mb-2">题目：</p>
                <p className="text-gray-700">{question.question}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-red-600 mb-1">你的答案：</p>
                  <p className="text-red-700 bg-red-50 p-2 rounded">{question.userAnswer}</p>
                </div>
                <div>
                  <p className="font-medium text-green-600 mb-1">正确答案：</p>
                  <p className="text-green-700 bg-green-50 p-2 rounded">{question.correctAnswer}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-gray-900 mb-1">解析：</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{question.explanation}</p>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    上次复习：{new Date(question.lastReviewDate).toLocaleDateString('zh-CN')}
                  </span>
                  <div className="flex items-center space-x-1">
                    {question.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm">
                    重新练习
                  </button>
                  {!question.isResolved && (
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                      标记已掌握
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FavoritesTab = () => (
    <div className="space-y-4">
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-pink-500 mr-3" />
            <div>
              <p className="text-sm text-pink-600">总收藏</p>
              <p className="text-2xl font-bold text-pink-700">{mockFavorites.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-blue-600">单词收藏</p>
              <p className="text-2xl font-bold text-blue-700">
                {mockFavorites.filter(f => f.type === 'word').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-purple-600">文章收藏</p>
              <p className="text-2xl font-bold text-purple-700">
                {mockFavorites.filter(f => f.type === 'article').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 收藏列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFavorites.map((favorite) => (
          <div key={favorite.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(favorite.type)}`}>
                {getTypeText(favorite.type)}
              </span>
              <Heart className="h-5 w-5 text-pink-500 fill-current" />
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{favorite.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{favorite.content}</p>
            
            {favorite.notes && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">笔记：</p>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{favorite.notes}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{favorite.source}</span>
              <span>{new Date(favorite.addedDate).toLocaleDateString('zh-CN')}</span>
            </div>
            
            <div className="flex items-center space-x-1 mt-2">
              {favorite.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
              <button className="flex-1 px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm">
                复习
              </button>
              <button className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                编辑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReviewPlanTab = () => (
    <div className="space-y-6">
      {/* 复习计划概览 */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4">今日复习计划</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm text-green-100 mb-1">错题复习</p>
            <p className="text-2xl font-bold">5 题</p>
            <p className="text-xs text-green-100">建议复习时间：15分钟</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm text-green-100 mb-1">收藏复习</p>
            <p className="text-2xl font-bold">8 项</p>
            <p className="text-xs text-green-100">建议复习时间：20分钟</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm text-green-100 mb-1">遗忘曲线</p>
            <p className="text-2xl font-bold">3 项</p>
            <p className="text-xs text-green-100">即将遗忘的内容</p>
          </div>
        </div>
      </div>

      {/* 复习日历 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">复习日历</h3>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 6; // 假设从上个月的几天开始
            const isToday = day === 15;
            const hasReview = [10, 12, 15, 18, 20].includes(day);
            
            return (
              <div
                key={i}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  isToday
                    ? 'bg-blue-500 text-white'
                    : hasReview
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'hover:bg-gray-100'
                } ${day <= 0 || day > 31 ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {day > 0 && day <= 31 ? day : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* 复习建议 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">智能复习建议</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">遗忘风险提醒</p>
              <p className="text-sm text-yellow-700">有3个单词即将进入遗忘期，建议今天复习</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <Target className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">复习重点</p>
              <p className="text-sm text-blue-700">语法类错题较多，建议加强语法练习</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">学习成果</p>
              <p className="text-sm text-green-700">本周已掌握15个新单词，继续保持！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">复习中心</h1>
        <p className="text-gray-600">巩固学习成果，查看错题和收藏内容</p>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('wrong')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'wrong'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <XCircle className="h-5 w-5 inline mr-2" />
            错题本
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'favorites'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Heart className="h-5 w-5 inline mr-2" />
            我的收藏
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'review'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-5 w-5 inline mr-2" />
            复习计划
          </button>
        </nav>
      </div>

      {/* 搜索和筛选 */}
      {(activeTab === 'wrong' || activeTab === 'favorites') && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部类型</option>
              <option value="word">单词</option>
              <option value="sentence">句子</option>
              <option value="article">文章</option>
              <option value="listening">听力</option>
            </select>
          </div>
        </div>
      )}

      {/* 标签页内容 */}
      {activeTab === 'wrong' && <WrongQuestionsTab />}
      {activeTab === 'favorites' && <FavoritesTab />}
      {activeTab === 'review' && <ReviewPlanTab />}
    </div>
  );
};

export default ReviewCenter;