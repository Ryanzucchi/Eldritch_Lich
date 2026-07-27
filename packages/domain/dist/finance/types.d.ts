export interface BudgetCategory {
    category: 'LABOR' | 'INFRASTRUCTURE' | 'MARKETING' | 'RESERVE' | 'OTHER';
    limitAmount: number;
}
export interface ProjectBudget {
    id: string;
    projectId: string;
    totalLimit: number;
    period: string;
    categories: BudgetCategory[];
    version: number;
    createdAt: string;
}
export interface FinancialTransaction {
    id: string;
    projectId: string;
    type: 'REVENUE' | 'EXPENSE';
    description: string;
    amount: number;
    dueDate: string;
    paymentDate?: string;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    category: 'REVENUE_OPERATIONAL' | 'LABOR' | 'INFRASTRUCTURE' | 'MARKETING' | 'OTHER';
    clientName?: string;
    attachmentUrl?: string;
    createdAt: string;
}
export interface CashFlowReport {
    initialBalance: number;
    totalInputs: number;
    totalOutputs: number;
    netCashFlow: number;
    finalBalance: number;
}
/**
 * Valida o limite do orçamento total (UC-381).
 */
export declare function validateBudgetLimits(budget: ProjectBudget): boolean;
/**
 * Regra de autocategorização baseada em nome/fornecedor (UC-384).
 */
export declare function autoCategorizeTransaction(description: string): FinancialTransaction['category'];
/**
 * Calcula o fluxo de caixa baseado em regime de caixa (líquido/realizado) (UC-385).
 */
export declare function calculateCashFlow(transactions: FinancialTransaction[], initialBalance?: number): CashFlowReport;
/**
 * Calcula o fluxo de caixa projetado (DRE previsto) (UC-385 alternativo).
 */
export declare function calculateProjectedCashFlow(transactions: FinancialTransaction[], initialBalance?: number): CashFlowReport;
