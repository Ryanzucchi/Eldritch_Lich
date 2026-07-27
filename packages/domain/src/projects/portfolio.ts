export interface CorporatePortfolio {
  id: string;
  name: string; // UC-352
  description: string;
  globalBudget: number; // Orçamento total do portfólio (UC-352)
  projectIds: string[]; // Projetos vinculados a este portfólio
  createdAt: string;
}

export interface ResourceAllocation {
  id: string;
  employeeId: string; // Colaborador alocado (UC-354)
  projectId: string; // Projeto destino
  allocationPercent: number; // Percentual de ocupação (ex: 40 para 40%)
  startDate: string;
  endDate: string;
  resourceType: 'PERSON' | 'EQUIPMENT' | 'SOFTWARE'; // UC-354 alternativo
  costPerMonth: number; // Custo proporcional para rateio
  createdAt: string;
}

export interface ProjectCostLog {
  id: string;
  projectId: string;
  category: 'LABOR' | 'INFRASTRUCTURE' | 'TRAVEL' | 'OTHER';
  amount: number; // Valor do custo (UC-355)
  date: string;
  description: string;
  attachmentUrl?: string; // Comprovante fiscal (UC-355)
}

export interface ProjectFinancials {
  projectId: string;
  projectName: string;
  budgetLimit: number; // Orçamento definido
  totalActualCost: number; // Custo realizado acumulado
  totalRevenue: number; // Receitas do projeto (UC-356)
  isInternal: boolean; // Projeto interno (sem receita direta)
}

/**
 * Calcula a soma dos custos agregados do projeto (UC-355).
 * Cruza despesas fixas manuais e custos de mão de obra proporcionais calculados a partir das alocações.
 */
export function calculateProjectTotalCosts(
  projectId: string,
  allocations: ResourceAllocation[],
  costLogs: ProjectCostLog[],
  monthsRange: number = 1
): number {
  const manualCosts = costLogs
    .filter(log => log.projectId === projectId)
    .reduce((acc, log) => acc + log.amount, 0);

  const laborCosts = allocations
    .filter(alloc => alloc.projectId === projectId)
    .reduce((acc, alloc) => acc + (alloc.costPerMonth * (alloc.allocationPercent / 100)) * monthsRange, 0);

  return Math.round((manualCosts + laborCosts) * 100) / 100;
}

/**
 * Calcula DRE simplificado, Lucro Bruto, Margem e ROI (UC-356).
 */
export function calculateProjectProfitability(financials: ProjectFinancials) {
  const profit = financials.totalRevenue - financials.totalActualCost;
  const marginPercent = financials.totalRevenue > 0
    ? Math.round((profit / financials.totalRevenue) * 100)
    : 0;

  const roiPercent = financials.totalActualCost > 0
    ? Math.round((profit / financials.totalActualCost) * 100)
    : 0;

  return {
    profit,
    marginPercent,
    roiPercent,
    status: profit >= 0 ? 'LUCRO' : 'PREJUIZO'
  };
}
