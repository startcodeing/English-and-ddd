import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VocabularyState } from '../types/store';

// 初始状态
const initialState: VocabularyState = {
  words: {
    items: [],
    loading: false,
    error: null,
    selectedWord: null
  },
  partsOfSpeech: {
    items: [],
    loading: false,
    error: null
  },
  wordBooks: {
    items: [],
    loading: false,
    error: null,
    selectedWordBook: null
  }
};

// 创建 slice
const vocabularySlice = createSlice({
  name: 'vocabulary',
  initialState,
  reducers: {
    // Words reducers
    fetchWordsStart: (state) => {
      state.words.loading = true;
      state.words.error = null;
    },
    fetchWordsSuccess: (state, action) => {
      state.words.loading = false;
      state.words.items = action.payload;
      state.words.error = null;
    },
    fetchWordsFailure: (state, action: PayloadAction<string>) => {
      state.words.loading = false;
      state.words.error = action.payload;
    },
    setSelectedWord: (state, action) => {
      state.words.selectedWord = action.payload;
    },
    
    // Parts of speech reducers
    fetchPartsOfSpeechStart: (state) => {
      state.partsOfSpeech.loading = true;
      state.partsOfSpeech.error = null;
    },
    fetchPartsOfSpeechSuccess: (state, action) => {
      state.partsOfSpeech.loading = false;
      state.partsOfSpeech.items = action.payload;
      state.partsOfSpeech.error = null;
    },
    fetchPartsOfSpeechFailure: (state, action: PayloadAction<string>) => {
      state.partsOfSpeech.loading = false;
      state.partsOfSpeech.error = action.payload;
    },
    
    // Word books reducers
    fetchWordBooksStart: (state) => {
      state.wordBooks.loading = true;
      state.wordBooks.error = null;
    },
    fetchWordBooksSuccess: (state, action) => {
      state.wordBooks.loading = false;
      state.wordBooks.items = action.payload;
      state.wordBooks.error = null;
    },
    fetchWordBooksFailure: (state, action: PayloadAction<string>) => {
      state.wordBooks.loading = false;
      state.wordBooks.error = action.payload;
    },
    setSelectedWordBook: (state, action) => {
      state.wordBooks.selectedWordBook = action.payload;
    }
  }
});

// 导出 actions
export const {
  fetchWordsStart,
  fetchWordsSuccess,
  fetchWordsFailure,
  setSelectedWord,
  fetchPartsOfSpeechStart,
  fetchPartsOfSpeechSuccess,
  fetchPartsOfSpeechFailure,
  fetchWordBooksStart,
  fetchWordBooksSuccess,
  fetchWordBooksFailure,
  setSelectedWordBook
} = vocabularySlice.actions;

// 导出 reducer
export default vocabularySlice.reducer;