export interface InvoiceLog {
  id: string;
  transactionId: string;
  invoiceNumber: string; // UC-386
  pdfUrl: string;
  xmlContent: string;
  issuedAt: string;
  status: 'SUCCESS' | 'FAILED' | 'RETRYING';
}

export interface BankIntegration {
  id: string;
  bankName: string;
  connectedAt: string;
  status: 'ACTIVE' | 'EXPIRED'; // UC-387
}

export interface BankStatementLine {
  id: string;
  integrationId: string;
  date: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  contrapartsCpfCnpj?: string; // UC-388
  reconciledTransactionId?: string; // Transação interna vinculada
}

export interface BudgetAlert {
  id: string;
  projectId: string;
  category: string;
  thresholdPercent: number; // 80, 90, 100
  actualAmount: number;
  limitAmount: number;
  message: string;
  createdAt: string;
}

/**
 * Executa simulação ou gatilho de emissão de NF (UC-386)
 */
export function simulateInvoiceGeneration(
  transactionId: string,
  amount: number,
  clientName: string
): InvoiceLog {
  const number = `NF-${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    id: `inv_${Date.now()}`,
    transactionId,
    invoiceNumber: number,
    pdfUrl: `/invoices/${number}.pdf`,
    xmlContent: `<xml><nf>${number}</nf><val>${amount}</val><cli>${clientName}</cli></xml>`,
    issuedAt: new Date().toISOString(),
    status: 'SUCCESS'
  };
}

/**
 * Algoritmo de Reconciliação Bancária Automática (UC-388)
 */
export function reconcileStatementWithTransactions(
  statements: BankStatementLine[],
  transactions: import('./types.js').FinancialTransaction[]
): {
  reconciledCount: number;
  updatedStatements: BankStatementLine[];
  updatedTransactions: import('./types.js').FinancialTransaction[];
} {
  let reconciledCount = 0;
  const updatedStatements = [...statements];
  const updatedTransactions = [...transactions];

  for (let i = 0; i < updatedStatements.length; i++) {
    const stmt = updatedStatements[i];
    if (stmt.reconciledTransactionId) continue;

    // Busca correspondência exata por valor e tipo
    const match = updatedTransactions.find(t => {
      if (t.status === 'PAID') return false; // Evita dupla reconciliação
      
      const isTypeMatch = (stmt.type === 'CREDIT' && t.type === 'REVENUE') || 
                          (stmt.type === 'DEBIT' && t.type === 'EXPENSE');
                          
      const isAmountMatch = t.amount === stmt.amount;
      
      return isTypeMatch && isAmountMatch;
    });

    if (match) {
      match.status = 'PAID';
      match.paymentDate = stmt.date;
      stmt.reconciledTransactionId = match.id;
      reconciledCount++;
    }
  }

  return {
    reconciledCount,
    updatedStatements,
    updatedTransactions
  };
}

/**
 * Verifica desvios orçamentários (UC-390)
 */
export function checkBudgetDeviations(
  projectId: string,
  budget: import('./types.js').ProjectBudget,
  transactions: import('./types.js').FinancialTransaction[],
  alertThreshold: number = 80 // Alerta em 80% padrão
): BudgetAlert[] {
  const alerts: BudgetAlert[] = [];

  for (let cat of budget.categories) {
    const expenses = transactions
      .filter(t => t.projectId === projectId && t.type === 'EXPENSE' && t.category === cat.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const percent = Math.round((expenses / cat.limitAmount) * 100);
    
    if (percent >= alertThreshold) {
      alerts.push({
        id: `alert_${cat.category}_${Date.now()}`,
        projectId,
        category: cat.category,
        thresholdPercent: percent >= 100 ? 100 : percent >= 90 ? 90 : 80,
        actualAmount: expenses,
        limitAmount: cat.limitAmount,
        message: `⚠️ Alerta Crítico: Limite de orçamento para ${cat.category} atingiu ${percent}% (${expenses}/${cat.limitAmount})!`,
        createdAt: new Date().toISOString()
      });
    }
  }

  return alerts;
}
