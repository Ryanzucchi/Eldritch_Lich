export interface BudgetCategory {
  category: 'LABOR' | 'INFRASTRUCTURE' | 'MARKETING' | 'RESERVE' | 'OTHER';
  limitAmount: number;
}

export interface ProjectBudget {
  id: string;
  projectId: string;
  totalLimit: number; // UC-381
  period: string; // Ex: "Q3 2026"
  categories: BudgetCategory[];
  version: number; // UC-381 revisão
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  projectId: string;
  type: 'REVENUE' | 'EXPENSE';
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string; // Liquidação (UC-385)
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  category: 'REVENUE_OPERATIONAL' | 'LABOR' | 'INFRASTRUCTURE' | 'MARKETING' | 'OTHER'; // UC-384
  clientName?: string; // UC-382
  attachmentUrl?: string; // Nota Fiscal / Recibo (UC-383)
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
export function validateBudgetLimits(budget: ProjectBudget): boolean {
  if (budget.totalLimit <= 0) return false;
  const sumCategories = budget.categories.reduce((acc, cat) => acc + cat.limitAmount, 0);
  return sumCategories <= budget.totalLimit;
}

/**
 * Regra de autocategorização baseada em nome/fornecedor (UC-384).
 */
export function autoCategorizeTransaction(description: string): FinancialTransaction['category'] {
  const descLower = description.toLowerCase();
  if (descLower.includes('aws') || descLower.includes('vercel') || descLower.includes('host') || descLower.includes('cloud')) {
    return 'INFRASTRUCTURE';
  }
  if (descLower.includes('salário') || descLower.includes('folha') || descLower.includes('dp') || descLower.includes('inss')) {
    return 'LABOR';
  }
  if (descLower.includes('anúncio') || descLower.includes('ads') || descLower.includes('google') || descLower.includes('facebook')) {
    return 'MARKETING';
  }
  return 'OTHER';
}

/**
 * Calcula o fluxo de caixa baseado em regime de caixa (líquido/realizado) (UC-385).
 */
export function calculateCashFlow(
  transactions: FinancialTransaction[],
  initialBalance: number = 0
): CashFlowReport {
  // Apenas liquidadas (possuem data de pagamento/recebimento)
  const settled = transactions.filter(t => !!t.paymentDate);
  
  const totalInputs = settled
    .filter(t => t.type === 'REVENUE')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalOutputs = settled
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashFlow = totalInputs - totalOutputs;
  
  return {
    initialBalance,
    totalInputs,
    totalOutputs,
    netCashFlow,
    finalBalance: initialBalance + netCashFlow
  };
}

/**
 * Calcula o fluxo de caixa projetado (DRE previsto) (UC-385 alternativo).
 */
export function calculateProjectedCashFlow(
  transactions: FinancialTransaction[],
  initialBalance: number = 0
): CashFlowReport {
  // Inclui todas as transações (liquidadas e pendentes)
  const totalInputs = transactions
    .filter(t => t.type === 'REVENUE')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalOutputs = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashFlow = totalInputs - totalOutputs;
  
  return {
    initialBalance,
    totalInputs,
    totalOutputs,
    netCashFlow,
    finalBalance: initialBalance + netCashFlow
  };
}
