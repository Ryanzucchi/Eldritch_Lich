export interface InvoiceLog {
    id: string;
    transactionId: string;
    invoiceNumber: string;
    pdfUrl: string;
    xmlContent: string;
    issuedAt: string;
    status: 'SUCCESS' | 'FAILED' | 'RETRYING';
}
export interface BankIntegration {
    id: string;
    bankName: string;
    connectedAt: string;
    status: 'ACTIVE' | 'EXPIRED';
}
export interface BankStatementLine {
    id: string;
    integrationId: string;
    date: string;
    description: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    contrapartsCpfCnpj?: string;
    reconciledTransactionId?: string;
}
export interface BudgetAlert {
    id: string;
    projectId: string;
    category: string;
    thresholdPercent: number;
    actualAmount: number;
    limitAmount: number;
    message: string;
    createdAt: string;
}
/**
 * Executa simulação ou gatilho de emissão de NF (UC-386)
 */
export declare function simulateInvoiceGeneration(transactionId: string, amount: number, clientName: string): InvoiceLog;
/**
 * Algoritmo de Reconciliação Bancária Automática (UC-388)
 */
export declare function reconcileStatementWithTransactions(statements: BankStatementLine[], transactions: import('./types.js').FinancialTransaction[]): {
    reconciledCount: number;
    updatedStatements: BankStatementLine[];
    updatedTransactions: import('./types.js').FinancialTransaction[];
};
/**
 * Verifica desvios orçamentários (UC-390)
 */
export declare function checkBudgetDeviations(projectId: string, budget: import('./types.js').ProjectBudget, transactions: import('./types.js').FinancialTransaction[], alertThreshold?: number): BudgetAlert[];
