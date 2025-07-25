import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Target, 
  Clock, 
  BookOpen, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useStudyPlanStore } from '../store';
import { StudyPlan } from '../types';

const StudyPlanPage: React.FC = () => {
  const { studyPlans, activeStudyPlan, setActiveStudyPlan } = useStudyPlanStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);

  // 模拟学习计划数据
  const mockPlans: StudyPlan[] = [
    {
      id: '1',
      name: '四级词汇突破计划',
      description: '30天内掌握四级核心词汇2000个',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      dailyGoal: {
        words: 70,
        sentences: 10,
        articles: 1,
        studyTime: 60
      },
      status: 'active',
      progress: 65
    },
    {
      id: '2',
      name: '听力强化训练',
      description: '提升英语听力理解能力',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      dailyGoal: {
        words: 20,
        sentences: 5,
        articles: 0,
        studyTime: 45
      },
      status: 'active',
      progress: 30
    },
    {
      id: '3',
      name: '阅读理解专项',
      description: '完成50篇阅读理解练习',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      dailyGoal: {
        words: 30,
        sentences: 8,
        articles: 2,
        studyTime: 90
      },
      status: 'completed',
      progress: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'paused':
        return '已暂停';
      default:
        return '未知';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const CreatePlanModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingPlan ? '编辑学习计划' : '创建学习计划'}
          </h2>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setEditingPlan(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">计划名称</label>
            <input
              type="text"
              defaultValue={editingPlan?.name || ''}
              placeholder="输入学习计划名称"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">计划描述</label>
            <textarea
              defaultValue={editingPlan?.description || ''}
              placeholder="描述你的学习目标和计划内容"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
              <input
                type="date"
                defaultValue={editingPlan?.startDate || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
              <input
                type="date"
                defaultValue={editingPlan?.endDate || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">每日学习目标</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">单词数量</label>
                <input
                  type="number"
                  defaultValue={editingPlan?.dailyGoal.words || 50}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">句子数量</label>
                <input
                  type="number"
                  defaultValue={editingPlan?.dailyGoal.sentences || 10}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文章数量</label>
                <input
                  type="number"
                  defaultValue={editingPlan?.dailyGoal.articles || 1}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">学习时长(分钟)</label>
                <input
                  type="number"
                  defaultValue={editingPlan?.dailyGoal.studyTime || 60}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setEditingPlan(null);
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {editingPlan ? '更新计划' : '创建计划'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学习计划</h1>
          <p className="text-gray-600">制定和管理你的学习计划，追踪学习进度</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          创建计划
        </button>
      </div>

      {/* 活跃计划概览 */}
      {activeStudyPlan && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">当前活跃计划</h2>
              <p className="text-blue-100">{activeStudyPlan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">完成进度</p>
              <p className="text-2xl font-bold">{activeStudyPlan.progress}%</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-full h-2 mb-4">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${activeStudyPlan.progress}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-100">每日单词</p>
              <p className="font-semibold">{activeStudyPlan.dailyGoal.words} 个</p>
            </div>
            <div>
              <p className="text-blue-100">每日句子</p>
              <p className="font-semibold">{activeStudyPlan.dailyGoal.sentences} 个</p>
            </div>
            <div>
              <p className="text-blue-100">每日文章</p>
              <p className="font-semibold">{activeStudyPlan.dailyGoal.articles} 篇</p>
            </div>
            <div>
              <p className="text-blue-100">每日时长</p>
              <p className="font-semibold">{activeStudyPlan.dailyGoal.studyTime} 分钟</p>
            </div>
          </div>
        </div>
      )}

      {/* 计划列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">我的学习计划</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockPlans.map((plan) => {
            const daysRemaining = calculateDaysRemaining(plan.endDate);
            const isActive = plan.status === 'active';
            
            return (
              <div key={plan.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                        {getStatusIcon(plan.status)}
                        <span className="ml-1">{getStatusText(plan.status)}</span>
                      </span>
                      {isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Clock className="h-3 w-3 mr-1" />
                          剩余 {daysRemaining} 天
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{plan.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(plan.startDate).toLocaleDateString('zh-CN')} - {new Date(plan.endDate).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        每日目标：{plan.dailyGoal.words}词 {plan.dailyGoal.sentences}句 {plan.dailyGoal.articles}文
                      </span>
                    </div>
                    
                    {/* 进度条 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">完成进度</span>
                        <span className="font-medium text-gray-900">{plan.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            plan.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* 每日目标详情 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                        <div>
                          <p className="text-gray-600">单词</p>
                          <p className="font-medium">{plan.dailyGoal.words}/天</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-green-500 mr-2" />
                        <div>
                          <p className="text-gray-600">句子</p>
                          <p className="font-medium">{plan.dailyGoal.sentences}/天</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
                        <div>
                          <p className="text-gray-600">文章</p>
                          <p className="font-medium">{plan.dailyGoal.articles}/天</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-500 mr-2" />
                        <div>
                          <p className="text-gray-600">时长</p>
                          <p className="font-medium">{plan.dailyGoal.studyTime}分钟</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2 ml-6">
                    {isActive && (
                      <button
                        onClick={() => setActiveStudyPlan(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="设为活跃计划"
                      >
                        <Play className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setShowCreateModal(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="编辑计划"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除计划"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 创建/编辑计划模态框 */}
      {showCreateModal && <CreatePlanModal />}
    </div>
  );
};

export default StudyPlanPage;