import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../types/store';

// 初始状态
const initialState: UIState = {
  theme: 'light',
  language: 'zh-CN',
  sidebarCollapsed: false,
  notifications: [],
  modals: {
    createWord: false,
    editWord: false,
    createWordBook: false,
    editWordBook: false,
    createSentence: false,
    editSentence: false,
    createArticle: false,
    editArticle: false,
    createDictation: false,
    createWriting: false,
    createListeningMaterial: false,
    editListeningMaterial: false
  }
};

// 创建 slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'info' | 'warning' | 'error';
      message: string;
      description?: string;
      duration?: number;
    }>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setModalState: (state, action: PayloadAction<{ modalId: string; visible: boolean }>) => {
      const { modalId, visible } = action.payload;
      state.modals = {
        ...state.modals,
        [modalId]: visible
      };
    }
  }
});

// 导出 actions
export const {
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarCollapsed,
  addNotification,
  removeNotification,
  clearNotifications,
  setModalState
} = uiSlice.actions;

// 导出 reducer
export default uiSlice.reducer;