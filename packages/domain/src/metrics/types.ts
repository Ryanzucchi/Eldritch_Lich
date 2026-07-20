export interface WritingGoal {
  id: string;
  type: 'DIARIA' | 'PRAZO';
  targetWords: number;        // e.g. 500 words per day, or 80000 total words
  deadline?: string;          // ISO Date for PRAZO meta
  documentIds: string[];      // Eligible doc ids
  createdAt: string;
}

export interface WritingLog {
  id: string;                 // unique identifier, e.g. "YYYY-MM-DD"
  wordsWritten: number;
  date: string;               // ISO date
}

export interface WritingStreak {
  id?: string;
  currentStreak: number;
  longestStreak: number;
  lastWrittenDate: string;    // "YYYY-MM-DD"
  offDays: string[];          // Days of the week as strings: e.g. ['0', '6'] (Sunday, Saturday) for protection
}
