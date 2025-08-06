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
  },
  listeningMaterials: {
    items: [],
    loading: false,
    error: null,
    selectedListeningMaterial: null,
    total: 0
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
    },
    
    // ListeningMaterials reducers
    fetchListeningMaterialsStart: (state) => {
      state.listeningMaterials.loading = true;
      state.listeningMaterials.error = null;
    },
    fetchListeningMaterialsSuccess: (state, action) => {
      state.listeningMaterials.loading = false;
      state.listeningMaterials.items = action.payload;
      state.listeningMaterials.error = null;
    },
    fetchListeningMaterialsFailure: (state, action: PayloadAction<string>) => {
      state.listeningMaterials.loading = false;
      state.listeningMaterials.error = action.payload;
    },
    setSelectedListeningMaterial: (state, action) => {
      state.listeningMaterials.selectedListeningMaterial = action.payload;
    },
    setListeningMaterialsTotal: (state, action: PayloadAction<number>) => {
      state.listeningMaterials.total = action.payload;
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
  setSelectedArticle,
  fetchListeningMaterialsStart,
  fetchListeningMaterialsSuccess,
  fetchListeningMaterialsFailure,
  setSelectedListeningMaterial,
  setListeningMaterialsTotal
} = contentSlice.actions;

// 导出 reducer
export default contentSlice.reducer;