"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleResearchReview = scheduleResearchReview;
/** Atualiza uma nota pelo SM-2; qualidade vai de 0 (esqueceu) a 5 (fácil). */
function scheduleResearchReview(note, quality, now = new Date()) {
    const grade = Math.max(0, Math.min(5, Math.round(quality)));
    const previousEase = note.easinessFactor ?? 2.5;
    const easinessFactor = Math.max(1.3, previousEase + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
    const previousRepetition = note.repetition ?? 0;
    const repetition = grade < 3 ? 0 : previousRepetition + 1;
    const intervalDays = grade < 3 ? 1 : repetition === 1 ? 1 : repetition === 2 ? 6 : Math.max(1, Math.round((note.intervalDays ?? 6) * easinessFactor));
    const next = new Date(now);
    next.setDate(next.getDate() + intervalDays);
    return { repetition, intervalDays, easinessFactor, nextReviewDate: next.toISOString() };
}
