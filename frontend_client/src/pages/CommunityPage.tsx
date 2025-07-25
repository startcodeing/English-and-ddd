import React, { useState } from 'react';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Users, 
  Calendar, 
  Trophy, 
  Target, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  Headphones,
  PenTool,
  Star,
  CheckCircle,
  TrendingUp,
  Award,
  Send
} from 'lucide-react';
import { StudyCheckIn, Comment, StudyGroup } from '../types';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkin' | 'groups' | 'leaderboard'>('checkin');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [newComment, setNewComment] = useState('');

  // 模拟学习打卡数据
  const mockCheckIns: StudyCheckIn[] = [
    {
      id: '1',
      userId: 'user1',
      userName: '小明同学',
      userAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=young%20student%20avatar%20friendly%20smile&image_size=square',
      content: '今天完成了50个四级单词的学习，感觉词汇量在稳步提升！继续加油💪',
      studyTime: 45,
      wordsLearned: 50,
      articlesRead: 2,
      createdAt: '2024-01-15T10:30:00Z',
      likes: 12,
      comments: 3,
      tags: ['词汇学习', '四级备考'],
      studyType: 'vocabulary'
    },
    {
      id: '2',
      userId: 'user2',
      userName: '英语达人',
      userAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=confident%20student%20avatar%20glasses&image_size=square',
      content: '听力练习30分钟，今天的BBC新闻听懂了80%，进步明显！分享一个小技巧：先看字幕理解内容，再不看字幕练习。',
      studyTime: 30,
      wordsLearned: 0,
      articlesRead: 0,
      createdAt: '2024-01-15T09:15:00Z',
      likes: 18,
      comments: 5,
      tags: ['听力训练', '学习技巧'],
      studyType: 'listening'
    },
    {
      id: '3',
      userId: 'user3',
      userName: '语法小王子',
      userAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=studious%20young%20person%20avatar%20books&image_size=square',
      content: '完成了虚拟语气的专项练习，这个语法点终于搞明白了！感谢群里同学的耐心解答🙏',
      studyTime: 60,
      wordsLearned: 20,
      articlesRead: 1,
      createdAt: '2024-01-15T08:45:00Z',
      likes: 15,
      comments: 7,
      tags: ['语法学习', '虚拟语气'],
      studyType: 'grammar'
    }
  ];

  // 模拟学习小组数据
  const mockGroups: StudyGroup[] = [
    {
      id: '1',
      name: '四级冲刺小组',
      description: '一起备考英语四级，互相监督，共同进步！',
      memberCount: 156,
      category: 'exam_prep',
      level: 'intermediate',
      isJoined: true,
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=study%20group%20books%20graduation%20cap&image_size=square',
      createdAt: '2024-01-01T00:00:00Z',
      tags: ['四级', '考试', '备考'],
      dailyActiveMembers: 45,
      weeklyGoal: '每日学习2小时'
    },
    {
      id: '2',
      name: '英语口语练习营',
      description: '提升口语表达能力，每日话题讨论，语音交流',
      memberCount: 89,
      category: 'speaking',
      level: 'beginner',
      isJoined: false,
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=speaking%20microphone%20conversation%20practice&image_size=square',
      createdAt: '2024-01-05T00:00:00Z',
      tags: ['口语', '对话', '发音'],
      dailyActiveMembers: 32,
      weeklyGoal: '每日口语练习30分钟'
    },
    {
      id: '3',
      name: '商务英语学习圈',
      description: '专注商务英语学习，职场英语应用，商务写作技巧',
      memberCount: 234,
      category: 'business',
      level: 'advanced',
      isJoined: true,
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=business%20professional%20office%20documents&image_size=square',
      createdAt: '2023-12-20T00:00:00Z',
      tags: ['商务英语', '职场', '写作'],
      dailyActiveMembers: 67,
      weeklyGoal: '完成商务英语案例分析'
    },
    {
      id: '4',
      name: '雅思备考联盟',
      description: '雅思考试备考，经验分享，模拟测试',
      memberCount: 312,
      category: 'exam_prep',
      level: 'advanced',
      isJoined: false,
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=ielts%20exam%20preparation%20international%20test&image_size=square',
      createdAt: '2023-11-15T00:00:00Z',
      tags: ['雅思', 'IELTS', '出国'],
      dailyActiveMembers: 89,
      weeklyGoal: '完成雅思模拟测试'
    }
  ];

  // 模拟排行榜数据
  const mockLeaderboard = [
    { rank: 1, name: '学霸小李', studyTime: 1250, wordsLearned: 2340, streak: 45, avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=top%20student%20crown%20achievement&image_size=square' },
    { rank: 2, name: '英语达人', studyTime: 1180, wordsLearned: 2156, streak: 38, avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=successful%20student%20medal%20winner&image_size=square' },
    { rank: 3, name: '词汇王者', studyTime: 1120, wordsLearned: 2089, streak: 42, avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vocabulary%20master%20books%20knowledge&image_size=square' },
    { rank: 4, name: '语法专家', studyTime: 1050, wordsLearned: 1876, streak: 35, avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=grammar%20expert%20teacher%20professional&image_size=square' },
    { rank: 5, name: '听力高手', studyTime: 980, wordsLearned: 1654, streak: 28, avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=listening%20expert%20headphones%20music&image_size=square' }
  ];

  const getStudyTypeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return <BookOpen className="h-4 w-4" />;
      case 'listening':
        return <Headphones className="h-4 w-4" />;
      case 'grammar':
        return <PenTool className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStudyTypeColor = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return 'bg-blue-100 text-blue-800';
      case 'listening':
        return 'bg-orange-100 text-orange-800';
      case 'grammar':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'exam_prep':
        return '考试备考';
      case 'speaking':
        return '口语练习';
      case 'business':
        return '商务英语';
      case 'daily':
        return '日常英语';
      default:
        return '综合学习';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return '不限';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const CheckInTab = () => (
    <div className="space-y-6">
      {/* 创建打卡按钮 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">今日学习打卡</h2>
            <p className="text-blue-100">分享你的学习成果，激励更多同学</p>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            发布打卡
          </button>
        </div>
      </div>

      {/* 打卡列表 */}
      <div className="space-y-6">
        {mockCheckIns.map((checkIn) => (
          <div key={checkIn.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* 用户信息 */}
            <div className="flex items-start space-x-4">
              <img
                src={checkIn.userAvatar}
                alt={checkIn.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{checkIn.userName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStudyTypeColor(checkIn.studyType)}`}>
                    {getStudyTypeIcon(checkIn.studyType)}
                    <span className="ml-1">
                      {checkIn.studyType === 'vocabulary' ? '词汇学习' :
                       checkIn.studyType === 'listening' ? '听力训练' :
                       checkIn.studyType === 'grammar' ? '语法学习' : '综合学习'}
                    </span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(checkIn.createdAt).toLocaleString('zh-CN')}
                  </span>
                </div>
                
                {/* 学习内容 */}
                <p className="text-gray-700 mb-4">{checkIn.content}</p>
                
                {/* 学习数据 */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm text-gray-600">学习时长</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">{checkIn.studyTime}分钟</p>
                  </div>
                  {checkIn.wordsLearned > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <BookOpen className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600">学习单词</span>
                      </div>
                      <p className="text-lg font-semibold text-green-600">{checkIn.wordsLearned}个</p>
                    </div>
                  )}
                  {checkIn.articlesRead > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <PenTool className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="text-sm text-gray-600">阅读文章</span>
                      </div>
                      <p className="text-lg font-semibold text-purple-600">{checkIn.articlesRead}篇</p>
                    </div>
                  )}
                </div>
                
                {/* 标签 */}
                <div className="flex items-center space-x-2 mb-4">
                  {checkIn.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* 互动按钮 */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>{checkIn.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>{checkIn.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>分享</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const GroupsTab = () => (
    <div className="space-y-6">
      {/* 我的小组 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">我的学习小组</h2>
          <button
            onClick={() => setShowJoinGroup(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            加入小组
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {mockGroups.filter(group => group.isJoined).map((group) => (
            <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(group.level)}`}>
                      {getLevelText(group.level)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {group.memberCount} 成员
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {group.dailyActiveMembers} 活跃
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    {group.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{group.weeklyGoal}</span>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                      进入小组
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐小组 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">推荐小组</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockGroups.filter(group => !group.isJoined).map((group) => (
            <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-20 h-20 rounded-lg object-cover mx-auto mb-3"
                />
                <h3 className="font-semibold text-gray-900 mb-1">{group.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{group.description}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {getCategoryText(group.category)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(group.level)}`}>
                    {getLevelText(group.level)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>成员数量</span>
                  <span className="font-medium">{group.memberCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>日活跃</span>
                  <span className="font-medium">{group.dailyActiveMembers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>周目标</span>
                  <span className="font-medium text-xs">{group.weeklyGoal}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 mb-4">
                {group.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {group.tags.length > 2 && (
                  <span className="text-xs text-gray-500">+{group.tags.length - 2}</span>
                )}
              </div>
              
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                加入小组
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LeaderboardTab = () => (
    <div className="space-y-6">
      {/* 排行榜类型选择 */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          本周排行
        </button>
        <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          本月排行
        </button>
        <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          总排行
        </button>
      </div>

      {/* 前三名展示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {mockLeaderboard.slice(0, 3).map((user, index) => (
          <div key={user.rank} className={`text-center p-6 rounded-xl ${
            index === 0 ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 text-white' :
            index === 1 ? 'bg-gradient-to-b from-gray-300 to-gray-400 text-white' :
            'bg-gradient-to-b from-orange-400 to-orange-500 text-white'
          }`}>
            <div className="relative mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white"
              />
              <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-yellow-600' :
                index === 1 ? 'bg-gray-600' :
                'bg-orange-600'
              }`}>
                {user.rank}
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{user.name}</h3>
            <div className="space-y-1 text-sm">
              <p>学习时长: {user.studyTime}分钟</p>
              <p>学习单词: {user.wordsLearned}个</p>
              <p>连续天数: {user.streak}天</p>
            </div>
          </div>
        ))}
      </div>

      {/* 完整排行榜 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">学习排行榜</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockLeaderboard.map((user) => (
            <div key={user.rank} className="p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                user.rank === 1 ? 'bg-yellow-500' :
                user.rank === 2 ? 'bg-gray-400' :
                user.rank === 3 ? 'bg-orange-500' :
                'bg-blue-500'
              }`}>
                {user.rank}
              </div>
              
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {user.studyTime}分钟
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {user.wordsLearned}词
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {user.streak}天
                  </span>
                </div>
              </div>
              
              {user.rank <= 3 && (
                <div className="flex items-center">
                  <Trophy className={`h-6 w-6 ${
                    user.rank === 1 ? 'text-yellow-500' :
                    user.rank === 2 ? 'text-gray-400' :
                    'text-orange-500'
                  }`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 我的排名 */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              15
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">我的排名</h3>
              <p className="text-sm text-gray-600">本周学习时长: 320分钟</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">距离前一名还差</p>
            <p className="text-lg font-bold text-blue-600">45分钟</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">社区互动</h1>
        <p className="text-gray-600">与其他学习者交流，分享学习心得，互相激励</p>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'checkin'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckCircle className="h-5 w-5 inline mr-2" />
            学习打卡
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'groups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-5 w-5 inline mr-2" />
            学习小组
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'leaderboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Trophy className="h-5 w-5 inline mr-2" />
            学习排行
          </button>
        </nav>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'checkin' && <CheckInTab />}
      {activeTab === 'groups' && <GroupsTab />}
      {activeTab === 'leaderboard' && <LeaderboardTab />}

      {/* 创建打卡模态框 */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">发布学习打卡</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分享你的学习内容</label>
                <textarea
                  placeholder="今天学了什么？有什么收获和感想？"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学习时长(分钟)</label>
                  <input
                    type="number"
                    placeholder="60"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学习单词数</label>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">阅读文章数</label>
                  <input
                    type="number"
                    placeholder="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">学习类型</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="vocabulary">词汇学习</option>
                  <option value="grammar">语法学习</option>
                  <option value="listening">听力训练</option>
                  <option value="reading">阅读理解</option>
                  <option value="writing">写作练习</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <input
                  type="text"
                  placeholder="用空格分隔多个标签，如：四级 词汇 备考"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  发布打卡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;