/**
 * 基础实体接口
 */
export interface BaseEntity {
  id: string;
}

/**
 * 词性接口
 */
export interface PartOfSpeech extends BaseEntity {
  englishName: string;
  chineseMeaning: string;
  usageSummary?: string;
  commonPhrases?: string[];
}

/**
 * 单词词义例句接口
 */
export interface WordMeaningSentence {
  id: string;
  meaningId: string;
  englishSentence: string;
  chineseSentence: string;
}

/**
 * 单词词义同义词接口
 */
export interface WordMeaningSynonym {
  id: string;
  meaningId: string;
  synonymWordId: string;
  synonymWord?: Word;
}

/**
 * 单词词义反义词接口
 */
export interface WordMeaningAntonym {
  id: string;
  meaningId: string;
  antonymWordId: string;
  antonymWord?: Word;
}

/**
 * 同义词信息接口
 */
export interface SynonymInfo {
  synonymWordId: string;
  synonymMeaningId: string;
}

/**
 * 反义词信息接口
 */
export interface AntonymInfo {
  antonymWordId: string;
  antonymMeaningId: string;
}

/**
 * 单词词义接口
 */
export interface WordMeaning extends BaseEntity {
  wordId: string;
  partOfSpeechId: string;
  partOfSpeech?: PartOfSpeech;
  chineseMeaning: string;
  synonymWordMeaningIds?: SynonymInfo[];
  antonymWordMeaningIds?: AntonymInfo[];
  exampleSentences?: WordMeaningSentence[];
  synonyms?: WordMeaningSynonym[];
  antonyms?: WordMeaningAntonym[];
  sentences?: Array<{
    englishContent: string;
    chineseMeaning: string;
  }>;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * 单词接口
 */
export interface Word extends BaseEntity {
  spelling: string;
  phonetic?: string;
  pronunciationUrl?: string;
  difficultyLevel?: number;
  meanings: WordMeaning[];
  createdAt?: number;
  updatedAt?: number;
}

/**
 * 详细同义词信息接口
 */
export interface DetailedSynonym {
  synonymSpell: string;
  synonymWordId: string;
  synonymMeaningId: string;
}

/**
 * 详细反义词信息接口
 */
export interface DetailedAntonym {
  antonymSpell: string;
  antonymWordId: string;
  antonymMeaningId: string;
}

/**
 * 详细例句信息接口
 */
export interface DetailedExampleSentence {
  id: string;
  englishContent: string;
  chineseMeaning: string;
}

/**
 * 详细词义接口
 */
export interface DetailedWordMeaning {
  id: string;
  wordId:string;
  partOfSpeechId: string;
  chineseMeaning: string;
  synonyms: DetailedSynonym[];
  antonyms: DetailedAntonym[];
  exampleSentences: DetailedExampleSentence[];
}

/**
 * 单词详情接口
 */
export interface WordDetail {
  id: string;
  spelling: string;
  phonetic?: string;
  difficultyLevel?: number;
  meanings: DetailedWordMeaning[];
}

/**
 * 单词本接口
 */
export interface WordBook extends BaseEntity {
  name: string;
  description?: string;
  words: Word[];
}

/**
 * 句子变体接口
 */
export interface SentenceVariant extends BaseEntity {
  content: string;
  type: string;
  description?: string;
}

/**
 * 句子接口
 */
export interface Sentence extends BaseEntity {
  englishContent: string;
  chineseMeaning: string;
  grammarAnalysis?: string;
  variants?: SentenceVariant[];
  unfamiliarWords?: Word[];
}

/**
 * 文章接口
 */
export interface Article extends BaseEntity {
  title: string;
  content: string;
  source?: string;
  author?: string;
  publishDate?: string;
  difficultyLevel?: number;
  unfamiliarWords?: Word[];
  sentences?: Sentence[];
}

/**
 * 听写练习接口
 */
export interface Dictation extends BaseEntity {
  title: string;
  description?: string;
  wordIds: string[];
  words?: Word[];
  createdAt: number;
  completedAt?: number;
  score?: number;
}

/**
 * 听写结果接口
 */
export interface DictationResult extends BaseEntity {
  dictationId: string;
  wordId: string;
  word?: Word;
  userInput: string;
  isCorrect: boolean;
  createdAt: number;
}

/**
 * 写作练习接口
 */
export interface Writing extends BaseEntity {
  title: string;
  topic: string;
  content?: string;
  feedback?: string;
  score?: number;
  createdAt: number;
  updatedAt?: number;
  submittedAt?: number;
}