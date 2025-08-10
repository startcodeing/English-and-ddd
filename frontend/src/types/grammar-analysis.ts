export interface GrammarAnalysis {
    id: number;
    title: string;
    originContent: string;
    difficulty: 'easy' | 'medium' | 'hard';
    createTime: string;
    updateTime: string;
}