import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentState } from '../types/store';

// 初始状态
const initialState: ContentState = {
  sentences: {
    items: [],
    loading: false,
    error: null,
    selectedSentence: null
  },
  articles: {
    items: [],
    loading: false,
    error: null,
    selectedArticle: null
  }
};

// 创建 slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Sentences reducers
    fetchSentencesStart: (state) => {
      state.sentences.loading = true;
      state.sentences.error = null;
    },
    fetchSentencesSuccess: (state, action) => {
      state.sentences.loading = false;
      state.sentences.items = action.payload;
      state.sentences.error = null;
    },
    fetchSentencesFailure: (state, action: PayloadAction<string>) => {
      state.sentences.loading = false;
      state.sentences.error = action.payload;
    },
    setSelectedSentence: (state, action) => {
      state.sentences.selectedSentence = action.payload;
    },
    
    // Articles reducers
    fetchArticlesStart: (state) => {
      state.articles.loading = true;
      state.articles.error = null;
    },
    fetchArticlesSuccess: (state, action) => {
      state.articles.loading = false;
      state.articles.items = action.payload;
      state.articles.error = null;
    },
    fetchArticlesFailure: (state, action: PayloadAction<string>) => {
      state.articles.loading = false;
      state.articles.error = action.payload;
    },
    setSelectedArticle: (state, action) => {
      state.articles.selectedArticle = action.payload;
    }
  }
});

// 导出 actions
export const {
  fetchSentencesStart,
  fetchSentencesSuccess,
  fetchSentencesFailure,
  setSelectedSentence,
  fetchArticlesStart,
  fetchArticlesSuccess,
  fetchArticlesFailure,
  setSelectedArticle
} = contentSlice.actions;

// 导出 reducer
export default contentSlice.reducer;