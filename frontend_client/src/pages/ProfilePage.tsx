import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  Settings, 
  TrendingUp,
  Target,
  Edit,
  Bell,
  Shield,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useUserStore, useStudyStore } from '../store';

const ProfilePage: React.FC = () => {
  const { user } = useUserStore();
  const { studyStats } = useStudyStore();
  const [activeTab, setActiveTab] = useState('stats');

  // 模拟成就数据
  const achievements = [
    {
      id: '1',
      name: '初学者',
      description: '完成第一次学习',
      icon: '🎯',
      isUnlocked: true,
      unlockedAt: '2024-01-01'
    },
    {
      id: '2',
      name: '坚持者',
      description: '连续学习7天',
      icon: '🔥',
      isUnlocked: true,
      unlockedAt: '2024-01-07'
    },
    {
      id: '3',
      name: '词汇大师',
      description: '学习1000个单词',
      icon: '📚',
      isUnlocked: true,
      unlockedAt: '2024-01-15'
    },
    {
      id: '4',
      name: '阅读爱好者',
      description: '阅读50篇文章',
      icon: '📖',
      isUnlocked: false,
      progress: 25,
      maxProgress: 50
    }
  ];

  // 图表数据
  const weeklyData = studyStats?.weeklyProgress.map(day => ({
    date: new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    studyTime: Math.floor(day.studyTime / 60),
    words: day.wordsLearned
  })) || [];

  const monthlyData = studyStats?.monthlyProgress.map(month => ({
    month: month.month,
    studyTime: Math.floor(month.studyTime / 3600),
    words: month.wordsLearned
  })) || [];

  const skillData = [
    { name: '词汇', value: 85, color: '#3B82F6' },
    { name: '语法', value: 72, color: '#10B981' },
    { name: '听力', value: 68, color: '#F59E0B' },
    { name: '阅读', value: 90, color: '#8B5CF6' },
    { name: '写作', value: 65, color: '#EF4444' }
  ];

  const renderStatsTab = () => (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总学习时长</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor((studyStats?.totalStudyTime || 0) / 3600)}小时
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
              <p className="text-sm font-medium text-gray-600">学习天数</p>
              <p className="text-2xl font-bold text-gray-900">{user?.totalStudyDays || 0}</p>
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

      {/* 学习趋势图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">本周学习趋势</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="studyTime" stroke="#3B82F6" strokeWidth={2} name="学习时长(分钟)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">月度学习统计</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="studyTime" fill="#10B981" name="学习时长(小时)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 技能分布 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">技能水平分布</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={skillData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {skillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {skillData.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: skill.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{skill.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${skill.value}%`,
                          backgroundColor: skill.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-10">{skill.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">我的成就</h3>
          <p className="text-gray-600">已解锁 {achievements.filter(a => a.isUnlocked).length} / {achievements.length} 个成就</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-6 rounded-lg border-2 transition-all ${
                  achievement.isUnlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`text-4xl mb-3 ${
                    achievement.isUnlocked ? 'grayscale-0' : 'grayscale'
                  }`}>
                    {achievement.icon}
                  </div>
                  <h4 className={`font-semibold mb-2 ${
                    achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-sm mb-3 ${
                    achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.isUnlocked ? (
                    <div className="text-xs text-green-600 font-medium">
                      已于 {new Date(achievement.unlockedAt!).toLocaleDateString('zh-CN')} 解锁
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress! / achievement.maxProgress!) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {achievement.progress} / {achievement.maxProgress}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* 个人信息设置 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">个人信息</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {user?.avatar ? (
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.username}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-600" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">{user?.username}</h4>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">Level {user?.level} · 加入于 {new Date(user?.createdAt || '').toLocaleDateString('zh-CN')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
              <input
                type="text"
                defaultValue={user?.username}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 学习偏好设置 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">学习偏好</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">每日学习目标（分钟）</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="15">15 分钟</option>
                <option value="30" selected>30 分钟</option>
                <option value="60">60 分钟</option>
                <option value="90">90 分钟</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">学习提醒时间</label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">学习重点</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['词汇学习', '语法练习', '听力训练', '阅读理解', '写作练习', '口语练习'].map((skill) => (
                <label key={skill} className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 通知设置 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">通知设置</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { name: '学习提醒', description: '每日学习时间提醒', enabled: true },
            { name: '复习提醒', description: '单词复习时间提醒', enabled: true },
            { name: '成就通知', description: '获得新成就时通知', enabled: false },
            { name: '社区动态', description: '关注的用户动态通知', enabled: false }
          ].map((setting) => (
            <div key={setting.name} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{setting.name}</h4>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          保存设置
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'stats', name: '学习统计', icon: TrendingUp },
    { id: 'achievements', name: '成就系统', icon: Award },
    { id: 'settings', name: '个人设置', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-6">
          {user?.avatar ? (
            <img
              className="w-20 h-20 rounded-full object-cover border-4 border-white"
              src={user.avatar}
              alt={user.username}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white">
              <User className="h-10 w-10 text-white" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{user?.username}</h1>
            <p className="text-blue-100 mb-2">{user?.email}</p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Level {user?.level}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                学习 {user?.totalStudyDays} 天
              </span>
              <span className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                连续 {user?.continuousStudyDays} 天
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 标签页内容 */}
      <div>
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default ProfilePage;