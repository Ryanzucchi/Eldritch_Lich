export interface KeyResult {
    id: string;
    name: string;
    initialValue: number;
    currentValue: number;
    targetValue: number;
    unit: 'PERCENT' | 'NUMBER' | 'CURRENCY';
    assigneeEmail?: string;
}
export interface ObjectiveOkr {
    id: string;
    projectId: string;
    title: string;
    ownerTeamOrProject: string;
    validityPeriod: string;
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
export declare function calculateKrProgress(kr: KeyResult): number;
/**
 * Calcula o progresso ponderado total de um Objetivo OKR (0 a 100).
 */
export declare function calculateOkrObjectiveProgress(okr: ObjectiveOkr): number;
/**
 * Consolida o Relatório de Atingimento (UC-349).
 */
export declare function generateOkrPerformanceReport(okrList: ObjectiveOkr[]): {
    finalScore: number;
    objectivesAnalyzed: number;
};
/**
 * Integra avaliação qualitativa com metas de KRs (UC-351).
 */
export declare function calculateIntegratedPerformanceScore(qualitativeScore: number, // 0 a 10
assignedKrs: KeyResult[], qualitativeWeight?: number): {
    finalScore: number;
    quantitativeScore: number;
    qualitativeContribution: number;
    quantitativeContribution: number;
};
