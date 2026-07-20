export interface WritingGoal {
    id: string;
    type: 'DIARIA' | 'PRAZO';
    targetWords: number;
    deadline?: string;
    documentIds: string[];
    createdAt: string;
}
export interface WritingLog {
    id: string;
    wordsWritten: number;
    date: string;
}
export interface WritingStreak {
    id?: string;
    currentStreak: number;
    longestStreak: number;
    lastWrittenDate: string;
    offDays: string[];
}
