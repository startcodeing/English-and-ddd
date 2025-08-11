export interface GrammarAnalysis {
    id: number;
    title: string;
    originContent: string;
    difficulty: 'easy' | 'medium' | 'hard' | null;
    createTime: string | null;
    updateTime: string | null;
}