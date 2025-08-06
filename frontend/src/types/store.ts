import { Word, PartOfSpeech, WordBook, Sentence, Article, Dictation, Writing } from './models';
import { ListeningMaterial } from './listeningMaterial';

/**
 * 应用全局状态接口
 */
export interface RootState {
  vocabulary: VocabularyState;
  content: ContentState;
  practice: PracticeState;
  ui: UIState;
}

/**
 * 词汇模块状态接口
 */
export interface VocabularyState {
  words: {
    items: Word[];
    loading: boolean;
    error: string | null;
    selectedWord: Word | null;
  };
  partsOfSpeech: {
    items: PartOfSpeech[];
    loading: boolean;
    error: string | null;
  };
  wordBooks: {
    items: WordBook[];
    loading: boolean;
    error: string | null;
    selectedWordBook: WordBook | null;
  };
}

/**
 * 内容模块状态接口
 */
export interface ContentState {
  sentences: {
    items: Sentence[];
    loading: boolean;
    error: string | null;
    selectedSentence: Sentence | null;
  };
  articles: {
    items: Article[];
    loading: boolean;
    error: string | null;
    selectedArticle: Article | null;
  };
  listeningMaterials: {
    items: ListeningMaterial[];
    loading: boolean;
    error: string | null;
    selectedListeningMaterial: ListeningMaterial | null;
    total: number;
  };
}

/**
 * 练习模块状态接口
 */
export interface PracticeState {
  dictations: {
    items: Dictation[];
    loading: boolean;
    error: string | null;
    currentDictation: Dictation | null;
    dictationResults: {
      [dictationId: string]: {
        wordId: string;
        userInput: string;
        isCorrect: boolean;
      }[];
    };
  };
  writings: {
    items: Writing[];
    loading: boolean;
    error: string | null;
    currentWriting: Writing | null;
  };
}

/**
 * UI状态接口
 */
export interface UIState {
  theme: 'light' | 'dark';
  language: string;
  sidebarCollapsed: boolean;
  notifications: {
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    description?: string;
    duration?: number;
  }[];
  modals: {
    createWord: boolean;
    editWord: boolean;
    createWordBook: boolean;
    editWordBook: boolean;
    createSentence: boolean;
    editSentence: boolean;
    createArticle: boolean;
    editArticle: boolean;
    createDictation: boolean;
    createWriting: boolean;
    createListeningMaterial: boolean;
    editListeningMaterial: boolean;
  };
}