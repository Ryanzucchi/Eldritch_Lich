import { WritingStreak } from './types.js';
/**
 * Calculates the updated streak statistics based on today's activity.
 * Supports off-days (streak protection).
 *
 * @param streak Current streak state
 * @param todayStr Today's date in "YYYY-MM-DD" format
 * @param wordsWrittenToday Number of words written today
 * @param minWordsForStreak Minimum words to count as active day (default: 200)
 */
export declare function calculateStreak(streak: WritingStreak, todayStr: string, wordsWrittenToday: number, minWordsForStreak?: number): WritingStreak;
/**
 * Calculates remaining daily quota for a deadline goal.
 * Returns required words per day.
 */
export declare function calculateDailyQuota(totalTarget: number, currentWritten: number, deadlineStr: string, todayStr: string): number;
