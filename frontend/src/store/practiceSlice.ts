import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PracticeState } from '../types/store';

// 初始状态
const initialState: PracticeState = {
  dictations: {
    items: [],
    loading: false,
    error: null,
    currentDictation: null,
    dictationResults: {}
  },
  writings: {
    items: [],
    loading: false,
    error: null,
    currentWriting: null
  }
};

// 创建 slice
const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    // Dictations reducers
    fetchDictationsStart: (state) => {
      state.dictations.loading = true;
      state.dictations.error = null;
    },
    fetchDictationsSuccess: (state, action) => {
      state.dictations.loading = false;
      state.dictations.items = action.payload;
      state.dictations.error = null;
    },
    fetchDictationsFailure: (state, action: PayloadAction<string>) => {
      state.dictations.loading = false;
      state.dictations.error = action.payload;
    },
    setCurrentDictation: (state, action) => {
      state.dictations.currentDictation = action.payload;
    },
    addDictationResult: (state, action: PayloadAction<{ dictationId: string; result: { wordId: string; userInput: string; isCorrect: boolean } }>) => {
      const { dictationId, result } = action.payload;
      if (!state.dictations.dictationResults[dictationId]) {
        state.dictations.dictationResults[dictationId] = [];
      }
      state.dictations.dictationResults[dictationId].push(result);
    },
    clearDictationResults: (state, action: PayloadAction<string>) => {
      delete state.dictations.dictationResults[action.payload];
    },
    
    // Writings reducers
    fetchWritingsStart: (state) => {
      state.writings.loading = true;
      state.writings.error = null;
    },
    fetchWritingsSuccess: (state, action) => {
      state.writings.loading = false;
      state.writings.items = action.payload;
      state.writings.error = null;
    },
    fetchWritingsFailure: (state, action: PayloadAction<string>) => {
      state.writings.loading = false;
      state.writings.error = action.payload;
    },
    setCurrentWriting: (state, action) => {
      state.writings.currentWriting = action.payload;
    }
  }
});

// 导出 actions
export const {
  fetchDictationsStart,
  fetchDictationsSuccess,
  fetchDictationsFailure,
  setCurrentDictation,
  addDictationResult,
  clearDictationResults,
  fetchWritingsStart,
  fetchWritingsSuccess,
  fetchWritingsFailure,
  setCurrentWriting
} = practiceSlice.actions;

// 导出 reducer
export default practiceSlice.reducer;