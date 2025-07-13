import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 导入 reducers
import vocabularyReducer from './vocabularySlice';
import contentReducer from './contentSlice';
import practiceReducer from './practiceSlice';
import uiReducer from './uiSlice';
import authReducer from './authSlice';

// 配置 store
export const store = configureStore({
  reducer: {
    vocabulary: vocabularyReducer,
    content: contentReducer,
    practice: practiceReducer,
    ui: uiReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 导出自定义 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;