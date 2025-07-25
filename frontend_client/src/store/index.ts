import { create } from 'zustand';
import { User, StudyStats, DailyRecommendation, StudyPlan, Achievement } from '../types';

// 用户状态管理
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  }))
}));

// 学习状态管理
interface StudyState {
  currentStudySession: {
    startTime: Date | null;
    studyTime: number;
    wordsLearned: number;
    sentencesLearned: number;
    articlesRead: number;
  };
  dailyRecommendation: DailyRecommendation | null;
  studyStats: StudyStats | null;
  startStudySession: () => void;
  endStudySession: () => void;
  updateStudyProgress: (type: 'word' | 'sentence' | 'article', count?: number) => void;
  setDailyRecommendation: (recommendation: DailyRecommendation) => void;
  setStudyStats: (stats: StudyStats) => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  currentStudySession: {
    startTime: null,
    studyTime: 0,
    wordsLearned: 0,
    sentencesLearned: 0,
    articlesRead: 0
  },
  dailyRecommendation: null,
  studyStats: null,
  startStudySession: () => set((state) => ({
    currentStudySession: {
      ...state.currentStudySession,
      startTime: new Date()
    }
  })),
  endStudySession: () => {
    const { currentStudySession } = get();
    if (currentStudySession.startTime) {
      const endTime = new Date();
      const studyTime = Math.floor((endTime.getTime() - currentStudySession.startTime.getTime()) / 1000);
      set((state) => ({
        currentStudySession: {
          ...state.currentStudySession,
          studyTime: state.currentStudySession.studyTime + studyTime,
          startTime: null
        }
      }));
    }
  },
  updateStudyProgress: (type, count = 1) => set((state) => {
    const updates: any = {};
    switch (type) {
      case 'word':
        updates.wordsLearned = state.currentStudySession.wordsLearned + count;
        break;
      case 'sentence':
        updates.sentencesLearned = state.currentStudySession.sentencesLearned + count;
        break;
      case 'article':
        updates.articlesRead = state.currentStudySession.articlesRead + count;
        break;
    }
    return {
      currentStudySession: {
        ...state.currentStudySession,
        ...updates
      }
    };
  }),
  setDailyRecommendation: (recommendation) => set({ dailyRecommendation: recommendation }),
  setStudyStats: (stats) => set({ studyStats: stats })
}));

// 学习计划状态管理
interface StudyPlanState {
  studyPlans: StudyPlan[];
  activeStudyPlan: StudyPlan | null;
  setStudyPlans: (plans: StudyPlan[]) => void;
  addStudyPlan: (plan: StudyPlan) => void;
  updateStudyPlan: (id: string, updates: Partial<StudyPlan>) => void;
  deleteStudyPlan: (id: string) => void;
  setActiveStudyPlan: (plan: StudyPlan | null) => void;
}

export const useStudyPlanStore = create<StudyPlanState>((set) => ({
  studyPlans: [],
  activeStudyPlan: null,
  setStudyPlans: (plans) => set({ studyPlans: plans }),
  addStudyPlan: (plan) => set((state) => ({
    studyPlans: [...state.studyPlans, plan]
  })),
  updateStudyPlan: (id, updates) => set((state) => ({
    studyPlans: state.studyPlans.map(plan => 
      plan.id === id ? { ...plan, ...updates } : plan
    ),
    activeStudyPlan: state.activeStudyPlan?.id === id 
      ? { ...state.activeStudyPlan, ...updates } 
      : state.activeStudyPlan
  })),
  deleteStudyPlan: (id) => set((state) => ({
    studyPlans: state.studyPlans.filter(plan => plan.id !== id),
    activeStudyPlan: state.activeStudyPlan?.id === id ? null : state.activeStudyPlan
  })),
  setActiveStudyPlan: (plan) => set({ activeStudyPlan: plan })
}));

// 成就系统状态管理
interface AchievementState {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  unlockedAchievements: [],
  setAchievements: (achievements) => set({ 
    achievements,
    unlockedAchievements: achievements.filter(a => a.isUnlocked)
  }),
  unlockAchievement: (achievementId) => set((state) => {
    const updatedAchievements = state.achievements.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, isUnlocked: true, unlockedAt: new Date().toISOString() }
        : achievement
    );
    return {
      achievements: updatedAchievements,
      unlockedAchievements: updatedAchievements.filter(a => a.isUnlocked)
    };
  }),
  updateAchievementProgress: (achievementId, progress) => set((state) => ({
    achievements: state.achievements.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, progress }
        : achievement
    )
  }))
}));

// UI状态管理
interface UIState {
  sidebarOpen: boolean;
  currentPage: string;
  loading: boolean;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  currentPage: 'home',
  loading: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setLoading: (loading) => set({ loading })
}));

// 模拟数据初始化
export const initializeMockData = () => {
  // 模拟用户数据
  const mockUser: User = {
    id: '1',
    username: '学习者小明',
    email: 'xiaoming@example.com',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20student%20avatar%20cartoon%20style&image_size=square',
    level: 5,
    totalStudyDays: 45,
    continuousStudyDays: 7,
    totalWords: 1250,
    totalSentences: 380,
    totalArticles: 25,
    createdAt: '2024-01-01T00:00:00Z'
  };

  // 模拟每日推荐数据
  const mockDailyRecommendation: DailyRecommendation = {
    words: [
      {
        id: '1',
        word: 'accomplish',
        pronunciation: '/əˈkʌmplɪʃ/',
        meaning: '完成，实现',
        partOfSpeech: 'verb',
        example: 'She accomplished her goal of learning 100 new words.',
        difficulty: 'medium'
      },
      {
        id: '2',
        word: 'brilliant',
        pronunciation: '/ˈbrɪljənt/',
        meaning: '聪明的，杰出的',
        partOfSpeech: 'adjective',
        example: 'He came up with a brilliant solution.',
        difficulty: 'medium'
      }
    ],
    sentences: [
      {
        id: '1',
        content: 'The early bird catches the worm.',
        translation: '早起的鸟儿有虫吃。',
        difficulty: 'easy',
        words: []
      }
    ],
    articles: [
      {
        id: '1',
        title: 'The Benefits of Learning English',
        content: 'Learning English opens doors to countless opportunities...',
        summary: 'An article about the advantages of English proficiency.',
        difficulty: 'medium',
        readingTime: 5,
        words: [],
        category: 'Education'
      }
    ],
    listeningMaterials: [
      {
        id: '1',
        title: 'Daily Conversation',
        audioUrl: '#',
        transcript: 'Hello, how are you today?',
        duration: 120,
        difficulty: 'easy'
      }
    ],
    writingTopics: [
      {
        id: '1',
        title: 'My Daily Routine',
        description: 'Write about your typical day',
        requirements: ['Use present tense', 'Include time expressions', 'Write at least 150 words'],
        difficulty: 'easy',
        timeLimit: 30
      }
    ]
  };

  // 模拟学习统计数据
  const mockStudyStats: StudyStats = {
    totalStudyTime: 2700, // 45 hours
    todayStudyTime: 1800, // 30 minutes
    weekStudyTime: 7200, // 2 hours
    monthStudyTime: 28800, // 8 hours
    totalWords: 1250,
    totalSentences: 380,
    totalArticles: 25,
    continuousStudyDays: 7,
    weeklyProgress: [
      { date: '2024-01-01', studyTime: 1800, wordsLearned: 15 },
      { date: '2024-01-02', studyTime: 2400, wordsLearned: 20 },
      { date: '2024-01-03', studyTime: 1200, wordsLearned: 10 },
      { date: '2024-01-04', studyTime: 3000, wordsLearned: 25 },
      { date: '2024-01-05', studyTime: 1800, wordsLearned: 15 }
    ],
    monthlyProgress: [
      { month: '2023-11', studyTime: 25200, wordsLearned: 200 },
      { month: '2023-12', studyTime: 28800, wordsLearned: 250 },
      { month: '2024-01', studyTime: 32400, wordsLearned: 300 }
    ]
  };

  // 初始化store数据
  useUserStore.getState().login(mockUser);
  useStudyStore.getState().setDailyRecommendation(mockDailyRecommendation);
  useStudyStore.getState().setStudyStats(mockStudyStats);
};