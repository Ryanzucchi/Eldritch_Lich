export interface CorporatePortfolio {
    id: string;
    name: string;
    description: string;
    globalBudget: number;
    projectIds: string[];
    createdAt: string;
}
export interface ResourceAllocation {
    id: string;
    employeeId: string;
    projectId: string;
    allocationPercent: number;
    startDate: string;
    endDate: string;
    resourceType: 'PERSON' | 'EQUIPMENT' | 'SOFTWARE';
    costPerMonth: number;
    createdAt: string;
}
export interface ProjectCostLog {
    id: string;
    projectId: string;
    category: 'LABOR' | 'INFRASTRUCTURE' | 'TRAVEL' | 'OTHER';
    amount: number;
    date: string;
    description: string;
    attachmentUrl?: string;
}
export interface ProjectFinancials {
    projectId: string;
    projectName: string;
    budgetLimit: number;
    totalActualCost: number;
    totalRevenue: number;
    isInternal: boolean;
}
/**
 * Calcula a soma dos custos agregados do projeto (UC-355).
 * Cruza despesas fixas manuais e custos de mão de obra proporcionais calculados a partir das alocações.
 */
export declare function calculateProjectTotalCosts(projectId: string, allocations: ResourceAllocation[], costLogs: ProjectCostLog[], monthsRange?: number): number;
/**
 * Calcula DRE simplificado, Lucro Bruto, Margem e ROI (UC-356).
 */
export declare function calculateProjectProfitability(financials: ProjectFinancials): {
    profit: number;
    marginPercent: number;
    roiPercent: number;
    status: string;
};
