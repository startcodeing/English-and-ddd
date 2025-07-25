import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Headphones, 
  PenTool, 
  MessageSquare,
  Play,
  Clock,
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useStudyStore } from '../store';

const StudyCenter: React.FC = () => {
  const { dailyRecommendation } = useStudyStore();
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const studyModules = [
    {
      id: 'vocabulary',
      name: '词汇学习',
      icon: BookOpen,
      description: '学习新单词，掌握词汇用法',
      color: 'bg-blue-500',
      count: dailyRecommendation?.words.length || 0
    },
    {
      id: 'sentences',
      name: '句子练习',
      icon: MessageSquare,
      description: '理解句子结构，提升语法能力',
      color: 'bg-green-500',
      count: dailyRecommendation?.sentences.length || 0
    },
    {
      id: 'reading',
      name: '文章阅读',
      icon: FileText,
      description: '阅读理解训练，扩展知识面',
      color: 'bg-purple-500',
      count: dailyRecommendation?.articles.length || 0
    },
    {
      id: 'listening',
      name: '听力训练',
      icon: Headphones,
      description: '提升听力理解，训练语感',
      color: 'bg-orange-500',
      count: dailyRecommendation?.listeningMaterials.length || 0
    },
    {
      id: 'writing',
      name: '写作练习',
      icon: PenTool,
      description: '练习写作技巧，表达思想',
      color: 'bg-red-500',
      count: dailyRecommendation?.writingTopics.length || 0
    }
  ];

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

  const filterContentByDifficulty = (items: any[]) => {
    if (difficultyFilter === 'all') return items;
    return items.filter(item => item.difficulty === difficultyFilter);
  };

  const renderVocabularyContent = () => {
    const words = filterContentByDifficulty(dailyRecommendation?.words || []);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word) => (
          <div key={word.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{word.word}</h3>
                <p className="text-sm text-gray-500">{word.pronunciation}</p>
                <p className="text-sm text-blue-600 font-medium">{word.partOfSpeech}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                {getDifficultyText(word.difficulty)}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">释义：</p>
                <p className="text-gray-900">{word.meaning}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">例句：</p>
                <p className="text-gray-600 italic">{word.example}</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium">
                <Play className="mr-1 h-4 w-4" />
                发音
              </button>
              <button className="flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-sm font-medium">
                <Star className="mr-1 h-4 w-4" />
                收藏
              </button>
              <Link 
                to={`/study/vocabulary/${word.id}`}
                className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 text-sm font-medium"
              >
                学习
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSentencesContent = () => {
    const sentences = filterContentByDifficulty(dailyRecommendation?.sentences || []);
    
    return (
      <div className="space-y-4">
        {sentences.map((sentence) => (
          <div key={sentence.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-lg text-gray-900 mb-2">{sentence.content}</p>
                <p className="text-gray-600">{sentence.translation}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(sentence.difficulty)}`}>
                {getDifficultyText(sentence.difficulty)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium">
                <Play className="mr-1 h-4 w-4" />
                朗读
              </button>
              <button className="flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-sm font-medium">
                <Star className="mr-1 h-4 w-4" />
                收藏
              </button>
              <Link 
                to={`/study/sentences/${sentence.id}`}
                className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 text-sm font-medium"
              >
                练习
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadingContent = () => {
    const articles = filterContentByDifficulty(dailyRecommendation?.articles || []);
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex-1">{article.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                  {getDifficultyText(article.difficulty)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {article.readingTime} 分钟
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md">{article.category}</span>
                </div>
              </div>
              
              <Link 
                to={`/study/reading/${article.id}`}
                className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                开始阅读
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListeningContent = () => {
    const materials = filterContentByDifficulty(dailyRecommendation?.listeningMaterials || []);
    
    return (
      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{material.title}</h3>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {Math.floor(material.duration / 60)}:{(material.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(material.difficulty)}`}>
                {getDifficultyText(material.difficulty)}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-4">
                <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                  <Play className="h-6 w-6" />
                </button>
                <div className="flex-1 bg-gray-300 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-0"></div>
                </div>
                <span className="text-sm text-gray-600">0:00 / {Math.floor(material.duration / 60)}:{(material.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-sm font-medium">
                <Star className="mr-1 h-4 w-4" />
                收藏
              </button>
              <Link 
                to={`/study/listening/${material.id}`}
                className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 text-sm font-medium"
              >
                开始练习
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWritingContent = () => {
    const topics = filterContentByDifficulty(dailyRecommendation?.writingTopics || []);
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex-1">{topic.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                {getDifficultyText(topic.difficulty)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{topic.description}</p>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">写作要求：</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {topic.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                建议时长：{topic.timeLimit} 分钟
              </span>
              <Link 
                to={`/study/writing/${topic.id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                开始写作
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'vocabulary':
        return renderVocabularyContent();
      case 'sentences':
        return renderSentencesContent();
      case 'reading':
        return renderReadingContent();
      case 'listening':
        return renderListeningContent();
      case 'writing':
        return renderWritingContent();
      default:
        return renderVocabularyContent();
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">学习中心</h1>
        <p className="text-gray-600">选择学习模块，开始你的英语学习之旅</p>
      </div>

      {/* 学习模块导航 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {studyModules.map((module) => {
          const Icon = module.icon;
          const isActive = activeTab === module.id;
          
          return (
            <button
              key={module.id}
              onClick={() => setActiveTab(module.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                isActive ? 'bg-blue-500' : module.color
              }`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-medium mb-1 ${
                isActive ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {module.name}
              </h3>
              <p className={`text-xs mb-2 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {module.description}
              </p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                isActive 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {module.count} 项内容
              </span>
            </button>
          );
        })}
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {studyModules.find(m => m.id === activeTab)?.name}
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
        </div>
      </div>

      {/* 学习内容 */}
      <div className="min-h-96">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudyCenter;