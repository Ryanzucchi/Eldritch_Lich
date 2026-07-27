export interface ProjectRisk {
    id: string;
    projectId: string;
    description: string;
    category: 'TECHNICAL' | 'FINANCIAL' | 'OPERATIONAL' | 'EXTERNAL';
    probability: 'LOW' | 'MEDIUM' | 'HIGH';
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'IDENTIFIED' | 'MITIGATED' | 'CONTINGENCY_ACTIVE';
    mitigationPlan?: string;
    contingencyPlan?: string;
    ownerEmail?: string;
    createdAt: string;
}
export interface HistoricalTask {
    id: string;
    projectId: string;
    executorEmail: string;
    complexity: 'LOW' | 'MEDIUM' | 'HIGH';
    leadTimeDays: number;
    createdAt: string;
    completedAt: string;
}
export interface LeadTimeEstimationResult {
    estimatedDays: number;
    confidencePercent: number;
    marginOfErrorDays: number;
}
/**
 * Calcula a criticidade do risco na matriz de calor (1 a 9).
 */
export declare function calculateRiskScore(risk: ProjectRisk): number;
/**
 * Estima o prazo de entrega baseando-se em Monte Carlo sobre lead time histórico (UC-357).
 */
export declare function estimateLeadTimeMonteCarlo(historicalTasks: HistoricalTask[], complexity: 'LOW' | 'MEDIUM' | 'HIGH', numTasksToEstimate?: number, simulations?: number): LeadTimeEstimationResult;
