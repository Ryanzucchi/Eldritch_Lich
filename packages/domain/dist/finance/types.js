"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBudgetLimits = validateBudgetLimits;
exports.autoCategorizeTransaction = autoCategorizeTransaction;
exports.calculateCashFlow = calculateCashFlow;
exports.calculateProjectedCashFlow = calculateProjectedCashFlow;
/**
 * Valida o limite do orçamento total (UC-381).
 */
function validateBudgetLimits(budget) {
    if (budget.totalLimit <= 0)
        return false;
    const sumCategories = budget.categories.reduce((acc, cat) => acc + cat.limitAmount, 0);
    return sumCategories <= budget.totalLimit;
}
/**
 * Regra de autocategorização baseada em nome/fornecedor (UC-384).
 */
function autoCategorizeTransaction(description) {
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
function calculateCashFlow(transactions, initialBalance = 0) {
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
function calculateProjectedCashFlow(transactions, initialBalance = 0) {
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
