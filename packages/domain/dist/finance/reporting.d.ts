export interface BalanceSheetReport {
    assets: {
        name: string;
        amount: number;
    }[];
    liabilities: {
        name: string;
        amount: number;
    }[];
    equity: {
        name: string;
        amount: number;
    }[];
    totalAssets: number;
    totalLiabilitiesAndEquity: number;
}
export interface IncomeStatementReport {
    grossRevenue: number;
    deductions: number;
    netRevenue: number;
    operatingExpenses: number;
    netIncome: number;
    unclassifiedTransactionsCount: number;
}
export interface CashFlowForecastCurve {
    date: string;
    optimisticAmount: number;
    realisticAmount: number;
    pessimisticAmount: number;
}
/**
 * Gera DRE contábil simplificado e detecta transações pendentes de classificação (UC-389).
 */
export declare function generateIncomeStatement(transactions: import('./types.js').FinancialTransaction[]): IncomeStatementReport;
/**
 * Estrutura Balanço Patrimonial (UC-389)
 */
export declare function generateBalanceSheet(transactions: import('./types.js').FinancialTransaction[], bankBalance?: number): BalanceSheetReport;
/**
 * Gera Previsão de Saldo de Caixa Futuro em 3 Cenários (UC-392)
 */
export declare function predictFutureCashFlowCurves(transactions: import('./types.js').FinancialTransaction[], initialBalance?: number, monthsRange?: number): CashFlowForecastCurve[];
