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
export function calculateStreak(
  streak: WritingStreak,
  todayStr: string,
  wordsWrittenToday: number,
  minWordsForStreak: number = 200
): WritingStreak {
  const result = { ...streak, offDays: streak.offDays || [] };
  
  if (wordsWrittenToday < minWordsForStreak) {
    // If today's quota is not met, check if the streak was already broken yesterday
    if (streak.lastWrittenDate) {
      const lastDate = new Date(streak.lastWrittenDate + 'T00:00:00');
      const today = new Date(todayStr + 'T00:00:00');
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        // Check if missed days were protected offDays
        let allMissedDaysProtected = true;
        const testDate = new Date(lastDate);
        testDate.setDate(testDate.getDate() + 1);
        
        while (testDate < today) {
          const dayOfWeek = testDate.getDay().toString();
          if (!result.offDays.includes(dayOfWeek)) {
            allMissedDaysProtected = false;
            break;
          }
          testDate.setDate(testDate.getDate() + 1);
        }
        
        if (!allMissedDaysProtected) {
          result.currentStreak = 0;
        }
      }
    }
    return result;
  }
  
  // If today's quota is met
  if (!streak.lastWrittenDate) {
    result.currentStreak = 1;
    result.lastWrittenDate = todayStr;
  } else if (streak.lastWrittenDate === todayStr) {
    // Already met today, no change
  } else {
    const lastDate = new Date(streak.lastWrittenDate + 'T00:00:00');
    const today = new Date(todayStr + 'T00:00:00');
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      result.currentStreak += 1;
      result.lastWrittenDate = todayStr;
    } else if (diffDays > 1) {
      let protectedStreak = true;
      const testDate = new Date(lastDate);
      testDate.setDate(testDate.getDate() + 1);
      
      while (testDate < today) {
        const dayOfWeek = testDate.getDay().toString();
        if (!result.offDays.includes(dayOfWeek)) {
          protectedStreak = false;
          break;
        }
        testDate.setDate(testDate.getDate() + 1);
      }
      
      if (protectedStreak) {
        result.currentStreak += 1;
      } else {
        result.currentStreak = 1;
      }
      result.lastWrittenDate = todayStr;
    }
  }
  
  if (result.currentStreak > result.longestStreak) {
    result.longestStreak = result.currentStreak;
  }
  
  return result;
}

/**
 * Calculates remaining daily quota for a deadline goal.
 * Returns required words per day.
 */
export function calculateDailyQuota(
  totalTarget: number,
  currentWritten: number,
  deadlineStr: string,
  todayStr: string
): number {
  const remaining = Math.max(0, totalTarget - currentWritten);
  if (remaining === 0) return 0;
  
  const today = new Date(todayStr + 'T00:00:00');
  const deadline = new Date(deadlineStr + 'T00:00:00');
  
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return remaining; // deadline is today or past
  
  return Math.ceil(remaining / diffDays);
}
