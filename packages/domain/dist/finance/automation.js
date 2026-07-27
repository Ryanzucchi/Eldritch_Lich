"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateInvoiceGeneration = simulateInvoiceGeneration;
exports.reconcileStatementWithTransactions = reconcileStatementWithTransactions;
exports.checkBudgetDeviations = checkBudgetDeviations;
/**
 * Executa simulação ou gatilho de emissão de NF (UC-386)
 */
function simulateInvoiceGeneration(transactionId, amount, clientName) {
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
function reconcileStatementWithTransactions(statements, transactions) {
    let reconciledCount = 0;
    const updatedStatements = [...statements];
    const updatedTransactions = [...transactions];
    for (let i = 0; i < updatedStatements.length; i++) {
        const stmt = updatedStatements[i];
        if (stmt.reconciledTransactionId)
            continue;
        // Busca correspondência exata por valor e tipo
        const match = updatedTransactions.find(t => {
            if (t.status === 'PAID')
                return false; // Evita dupla reconciliação
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
function checkBudgetDeviations(projectId, budget, transactions, alertThreshold = 80 // Alerta em 80% padrão
) {
    const alerts = [];
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
