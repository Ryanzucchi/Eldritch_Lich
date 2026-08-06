import { ResearchNote } from './types.js';
/** Atualiza uma nota pelo SM-2; qualidade vai de 0 (esqueceu) a 5 (fácil). */
export declare function scheduleResearchReview(note: ResearchNote, quality: number, now?: Date): Pick<ResearchNote, 'repetition' | 'intervalDays' | 'easinessFactor' | 'nextReviewDate'>;
