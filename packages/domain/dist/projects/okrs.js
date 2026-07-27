"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateKrProgress = calculateKrProgress;
exports.calculateOkrObjectiveProgress = calculateOkrObjectiveProgress;
exports.generateOkrPerformanceReport = generateOkrPerformanceReport;
exports.calculateIntegratedPerformanceScore = calculateIntegratedPerformanceScore;
/**
 * Calcula o progresso percentual acumulado de um Key Result (0 a 100).
 */
function calculateKrProgress(kr) {
    const range = kr.targetValue - kr.initialValue;
    if (range === 0)
        return 100;
    const currentDiff = kr.currentValue - kr.initialValue;
    const progress = (currentDiff / range) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
}
/**
 * Calcula o progresso ponderado total de um Objetivo OKR (0 a 100).
 */
function calculateOkrObjectiveProgress(okr) {
    if (okr.keyResults.length === 0)
        return 0;
    const sum = okr.keyResults.reduce((acc, kr) => acc + calculateKrProgress(kr), 0);
    return Math.round(sum / okr.keyResults.length);
}
/**
 * Consolida o Relatório de Atingimento (UC-349).
 */
function generateOkrPerformanceReport(okrList) {
    if (okrList.length === 0)
        return { finalScore: 0, objectivesAnalyzed: 0 };
    const sum = okrList.reduce((acc, okr) => acc + calculateOkrObjectiveProgress(okr), 0);
    return {
        finalScore: Math.round((sum / okrList.length) / 10) / 10, // Escala de 0.0 a 10.0
        objectivesAnalyzed: okrList.length
    };
}
/**
 * Integra avaliação qualitativa com metas de KRs (UC-351).
 */
function calculateIntegratedPerformanceScore(qualitativeScore, // 0 a 10
assignedKrs, qualitativeWeight = 0.6 // Peso qualitativo (padrão 60%)
) {
    if (assignedKrs.length === 0) {
        return {
            finalScore: qualitativeScore,
            quantitativeScore: 0,
            qualitativeContribution: qualitativeScore,
            quantitativeContribution: 0
        };
    }
    const sumProgress = assignedKrs.reduce((acc, kr) => acc + calculateKrProgress(kr), 0);
    const avgProgress = sumProgress / assignedKrs.length; // 0 a 100
    const quantitativeScore = (avgProgress / 100) * 10; // Escala de 0 a 10
    const quantWeight = 1 - qualitativeWeight;
    const qualContrib = qualitativeScore * qualitativeWeight;
    const quantContrib = quantitativeScore * quantWeight;
    return {
        finalScore: Math.round((qualContrib + quantContrib) * 100) / 100,
        quantitativeScore: Math.round(quantitativeScore * 100) / 100,
        qualitativeContribution: Math.round(qualContrib * 100) / 100,
        quantitativeContribution: Math.round(quantContrib * 100) / 100
    };
}
