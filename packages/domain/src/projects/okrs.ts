export interface KeyResult {
  id: string;
  name: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  unit: 'PERCENT' | 'NUMBER' | 'CURRENCY';
  assigneeEmail?: string; // UC-346, UC-351
}

export interface ObjectiveOkr {
  id: string;
  projectId: string;
  title: string;
  ownerTeamOrProject: string;
  validityPeriod: string; // ex: "Q3 2026"
  description: string;
  keyResults: KeyResult[];
  createdAt: string;
  status: 'NO_PRAZO' | 'ATRASADO' | 'CRITICO';
}

export interface OkrCheckInLog {
  id: string;
  objectiveId: string;
  keyResultId: string;
  oldValue: number;
  newValue: number;
  progressNote: string;
  authorEmail: string;
  timestamp: string;
}

export interface OkrTaskLink {
  id: string;
  taskId: string;
  objectiveId: string;
  keyResultId: string;
  createdAt: string;
}

/**
 * Calcula o progresso percentual acumulado de um Key Result (0 a 100).
 */
export function calculateKrProgress(kr: KeyResult): number {
  const range = kr.targetValue - kr.initialValue;
  if (range === 0) return 100;
  const currentDiff = kr.currentValue - kr.initialValue;
  const progress = (currentDiff / range) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

/**
 * Calcula o progresso ponderado total de um Objetivo OKR (0 a 100).
 */
export function calculateOkrObjectiveProgress(okr: ObjectiveOkr): number {
  if (okr.keyResults.length === 0) return 0;
  const sum = okr.keyResults.reduce((acc, kr) => acc + calculateKrProgress(kr), 0);
  return Math.round(sum / okr.keyResults.length);
}

/**
 * Consolida o Relatório de Atingimento (UC-349).
 */
export function generateOkrPerformanceReport(okrList: ObjectiveOkr[]) {
  if (okrList.length === 0) return { finalScore: 0, objectivesAnalyzed: 0 };
  const sum = okrList.reduce((acc, okr) => acc + calculateOkrObjectiveProgress(okr), 0);
  return {
    finalScore: Math.round((sum / okrList.length) / 10) / 10, // Escala de 0.0 a 10.0
    objectivesAnalyzed: okrList.length
  };
}

/**
 * Integra avaliação qualitativa com metas de KRs (UC-351).
 */
export function calculateIntegratedPerformanceScore(
  qualitativeScore: number, // 0 a 10
  assignedKrs: KeyResult[],
  qualitativeWeight: number = 0.6 // Peso qualitativo (padrão 60%)
): { finalScore: number; quantitativeScore: number; qualitativeContribution: number; quantitativeContribution: number } {
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
